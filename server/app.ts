import express, { type Request, type Response, type NextFunction } from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { config, readiness } from './config.js';
import { database, checked, rpc } from './db.js';
import { verifyAccount } from './firebase.js';
import { AppError, accessAllowed } from './policy.js';
import { checkout, syncBilling, paymentGateway, handleBillingEvent } from './billing.js';
import { runAI } from './ai.js';
import { operations } from './operations.js';
import { emptyKnowledge, knowledgeSchema, planSchema } from '../shared/schema.js';

export const app = express();
app.disable('x-powered-by');
if(process.env.VERCEL==='1') app.set('trust proxy',1);
app.use(helmet({contentSecurityPolicy:false}));
app.post('/api/billing/webhook',express.raw({type:'application/json',limit:'256kb'}),async(req,res,next)=>{
  try {
    const gateway=paymentGateway();
    let event;
    try { event=gateway.webhooks.constructEvent(req.body,req.headers['stripe-signature'] as string,config.STRIPE_WEBHOOK_SECRET); }
    catch { throw new AppError(400,'Invalid webhook signature.'); }
    await handleBillingEvent(event);
    res.json({received:true});
  } catch(e) { next(e); }
});
app.use('/api',rateLimit({windowMs:60000,limit:90,standardHeaders:'draft-8',legacyHeaders:false,message:{error:'Too many requests. Please wait a minute.'}}));
app.use(express.json({limit:'80kb'}));
app.use('/api',(req,res,next)=>{
  res.setHeader('Cache-Control','no-store');
  if (req.method!=='GET' && req.headers.origin && req.headers.origin!==new URL(config.APP_URL).origin) return next(new AppError(403,'Unrecognized request origin.'));
  next();
});
app.get('/api/config',(_req,res)=>res.json({
  ...readiness, firebase:{apiKey:config.FIREBASE_API_KEY,authDomain:config.FIREBASE_AUTH_DOMAIN,projectId:config.FIREBASE_PROJECT_ID,appId:config.FIREBASE_APP_ID},
  stripePublishableKey:config.STRIPE_PUBLISHABLE_KEY, testMode:!config.STRIPE_SECRET_KEY.startsWith('sk_live_'),

}));
app.get('/api/health',(_req,res)=>res.json({ok:true,services:readiness}));
app.use('/api',async(req,res,next)=>{
  try {
    const token=req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
    if (!token) throw new AppError(401,'Sign in to continue.');
    const user=await verifyAccount(token);
    const account=await rpc('ensure_firebase_workspace',{p_uid:user.uid});
    const workspace=account.workspace_id;
    const membership=await checked(database().from('memberships').select('workspace_id').eq('workspace_id',workspace).eq('user_id',account.user_id).maybeSingle());
    if(!membership) throw new AppError(403,'Workspace access denied.');
    res.locals.user=user; res.locals.workspace=workspace;
    next();
  } catch(e) {next(e);}
});

app.use('/api/operations',operations);
app.get('/api/workspace',async(_req,res,next)=>{
  try {
    const w=res.locals.workspace;
    let syncWarning:string|undefined;
    if(readiness.billing) { try {await syncBilling(w);} catch {syncWarning='Billing could not be refreshed. New generation requires a successful billing check.';} }
    const [workspace,k,plans,b,usage]=await Promise.all([
      checked(database().from('workspaces').select('id,name').eq('id',w).single()),
      checked(database().from('knowledge').select('content').eq('workspace_id',w).single()),
      checked(database().from('plans').select('id,version,content,approved_at,created_at').eq('workspace_id',w).order('version',{ascending:false})),
      checked(database().from('billing').select('*').eq('workspace_id',w).single()), rpc('usage_summary',{p_workspace:w}),
    ]);
    res.json({workspace,knowledge:{...emptyKnowledge,...k.content},plans,usage,syncWarning,billing:{status:b.status,tier:b.tier,periodEnd:b.period_end,cancelAtEnd:b.cancel_at_end,review:b.review_required,trialUsed:b.trial_used,access:!syncWarning&&accessAllowed(b)}});
  } catch(e){next(e);}
});
app.put('/api/knowledge',async(req,res,next)=>{
  try {
    const content=knowledgeSchema.parse(req.body);
    await checked(database().from('knowledge').update({content}).eq('workspace_id',res.locals.workspace));
    await checked(database().from('workspaces').update({name:content.name||'My business'}).eq('id',res.locals.workspace));
    res.json({saved:true});
  } catch(e){next(e);}
});
async function paidAccess(workspace:string) {
  await syncBilling(workspace);
  const b=await checked(database().from('billing').select('*').eq('workspace_id',workspace).single());
  if(!accessAllowed(b)) throw new AppError(402,b.review_required?'Your trial needs eligibility review. Renewal is stopped while access is reviewed.':'Start a trial or subscription to generate and test your plan.');
}
app.post('/api/plans/generate',async(req,res,next)=>{
  try {
    const {prompt}=z.object({prompt:z.string().trim().min(10).max(3000)}).parse(req.body);
    const w=res.locals.workspace;
    await paidAccess(w);
    const k=await checked(database().from('knowledge').select('content').eq('workspace_id',w).single());
    const content=await runAI(w,'plan',{prompt,knowledge:k.content});
    const plan=await rpc('create_plan',{p_workspace:w,p_content:content});
    res.json(plan);
  } catch(e){next(e);}
});
app.post('/api/plans',async(req,res,next)=>{
  try {
    const content=planSchema.parse(req.body);
    // Manual editing of saved work stays available even after a subscription ends.
    res.json(await rpc('create_plan',{p_workspace:res.locals.workspace,p_content:content}));
  } catch(e){next(e);}
});
app.post('/api/plans/:id/approve',async(req,res,next)=>{
  try {
    const id=z.string().uuid().parse(req.params.id);
    const plan=await checked(database().from('plans').update({approved_at:new Date().toISOString()}).eq('id',id).eq('workspace_id',res.locals.workspace).select('*').maybeSingle());
    if(!plan) throw new AppError(404,'Plan not found.');
    res.json(plan);
  } catch(e){next(e);}
});
app.get('/api/chat/:planId',async(req,res,next)=>{
  try {
    const planId=z.string().uuid().parse(req.params.planId);
    const rows=await checked(database().from('conversations').select('id,messages').eq('workspace_id',res.locals.workspace).eq('plan_id',planId).order('updated_at',{ascending:false}).limit(1));
    res.json(rows[0]??{id:null,messages:[]});
  } catch(e){next(e);}
});
app.post('/api/chat',async(req,res,next)=>{
  try {
    const {planId,conversationId,message}=z.object({planId:z.string().uuid(),conversationId:z.string().uuid().nullable(),message:z.string().trim().min(1).max(2000)}).parse(req.body);
    const w=res.locals.workspace;
    await paidAccess(w);
    const plan=await checked(database().from('plans').select('*').eq('workspace_id',w).eq('id',planId).maybeSingle());
    if(!plan?.approved_at) throw new AppError(409,'Approve this plan version before testing it.');
    let conversation=null;
    if(conversationId) {
      conversation=await checked(database().from('conversations').select('*').eq('id',conversationId).eq('workspace_id',w).eq('plan_id',planId).maybeSingle());
      if(!conversation) throw new AppError(404,'Conversation not found.');
    }
    const previous=conversation?.messages??[];
    if(previous.length>=40) throw new AppError(409,'This test reached 20 replies. Start a new conversation.');
    const k=await checked(database().from('knowledge').select('content').eq('workspace_id',w).single());
    const text=await runAI(w,'reply',{plan:plan.content,knowledge:k.content,messages:[...previous.slice(-12),{role:'user',text:message}]});
    const messages=[...previous,{role:'user',text:message},{role:'model',text}];
    const data={workspace_id:w,plan_id:planId,messages,updated_at:new Date().toISOString()};
    const saved=await checked(conversation
      ?database().from('conversations').update(data).eq('id',conversation.id).eq('workspace_id',w).select('id,messages').single()
      :database().from('conversations').insert(data).select('id,messages').single());
    res.json(saved);
  } catch(e){next(e);}
});
app.post('/api/billing/checkout',async(req,res,next)=>{
  try {
    const {mode}=z.object({mode:z.enum(['trial','paid'])}).parse(req.body);
    if(mode==='trial' && (!config.RESEND_API_KEY || !config.EMAIL_FROM)) throw new AppError(503,'Trial reminder emails are not connected yet. No trial has been started.');
    res.json({url:await checkout(res.locals.workspace,res.locals.user.email_verified?res.locals.user.email:undefined,mode)});
  } catch(e){next(e);}
});
app.post('/api/billing/portal',async(_req,res,next)=>{
  try {
    const b=await checked(database().from('billing').select('customer_id').eq('workspace_id',res.locals.workspace).single());
    if(!b.customer_id) throw new AppError(409,'There is no billing account yet.');
    const session=await paymentGateway().billingPortal.sessions.create({customer:b.customer_id,return_url:`${config.APP_URL}/workspace?tab=billing`});
    res.json({url:session.url});
  } catch(e){next(e);}
});
app.post('/api/billing/cancel',async(_req,res,next)=>{
  try {
    await syncBilling(res.locals.workspace);
    const b=await checked(database().from('billing').select('subscription_id').eq('workspace_id',res.locals.workspace).single());
    if(!b.subscription_id) throw new AppError(409,'There is no subscription to cancel.');
    await paymentGateway().subscriptions.update(b.subscription_id,{cancel_at_period_end:true});
    await syncBilling(res.locals.workspace);
    res.json({cancelled:true});
  } catch(e){next(e);}
});
app.use('/api',(_req,_res,next)=>next(new AppError(404,'Endpoint not found.')));
app.use((error:any,_req:Request,res:Response,_next:NextFunction)=>{
  const status=error instanceof z.ZodError?400:error instanceof AppError?error.status:500;
  const message=error instanceof z.ZodError?'Please check the entered values and field limits.':error instanceof AppError?error.message:'The service could not complete the request. Please retry.';
  if(status>=500) console.error('Request failed:',error.constructor?.name??'Error');
  res.status(status).json({error:message});
});
