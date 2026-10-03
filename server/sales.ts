import {Router} from 'express';
import {z} from 'zod';
import {database,checked} from './db.js';
import {AppError} from './policy.js';
import {offerInput,offerApproval,followupInput,followupPatch,rm,type Offer} from '../shared/sales.js';
export const sales=Router();
const fields='id,name,description,price_sen,terms,approved_at,updated_at';
const tasks='id,lead_id,title,notes,due_at,status,updated_at';
sales.get('/',async(_req,res,next)=>{try{const w=res.locals.workspace;const [offers,followups,leads]=await Promise.all([
 checked(database().from('sales_offers').select(fields).eq('workspace_id',w).order('updated_at',{ascending:false}).limit(200)),
 checked(database().from('sales_followups').select(tasks).eq('workspace_id',w).order('due_at').limit(200)),
 checked(database().from('crm_leads').select('id,name').eq('workspace_id',w).order('updated_at',{ascending:false}).limit(200)),
]);res.json({offers,followups,leads});}catch(e){next(e);}});
sales.post('/offers',async(req,res,next)=>{try{const input=offerInput.parse(req.body);res.status(201).json(await checked(database().from('sales_offers').insert({...input,workspace_id:res.locals.workspace}).select(fields).single()));}catch(e){next(e);}});
sales.put('/offers/:id',async(req,res,next)=>{try{const row=await checked(database().from('sales_offers').update({...offerInput.parse(req.body),approved_at:null}).eq('workspace_id',res.locals.workspace).eq('id',z.uuid().parse(req.params.id)).select(fields).maybeSingle());if(!row)throw new AppError(404,'Offer not found.');res.json(row);}catch(e){next(e);}});
sales.post('/offers/:id/approval',async(req,res,next)=>{try{const input=offerApproval.parse(req.body);const row=await checked(database().from('sales_offers').update({approved_at:new Date().toISOString()}).eq('workspace_id',res.locals.workspace).eq('id',z.uuid().parse(req.params.id)).eq('updated_at',input.expected_updated_at).select(fields).maybeSingle());if(!row)throw new AppError(409,'Offer changed or is unavailable. Refresh and review before approving.');res.json(row);}catch(e){next(e);}});
sales.post('/followups',async(req,res,next)=>{try{const input=followupInput.parse(req.body);res.status(201).json(await checked(database().from('sales_followups').insert({...input,workspace_id:res.locals.workspace}).select(tasks).single()));}catch(e){next(e);}});
sales.patch('/followups/:id',async(req,res,next)=>{try{const row=await checked(database().from('sales_followups').update({...followupPatch.parse(req.body),updated_at:new Date().toISOString()}).eq('workspace_id',res.locals.workspace).eq('id',z.uuid().parse(req.params.id)).select(tasks).maybeSingle());if(!row)throw new AppError(404,'Follow-up not found.');res.json(row);}catch(e){next(e);}});
export async function approvedCatalogue(workspace:string){
 const rows=await checked(database().from('sales_offers').select(fields).eq('workspace_id',workspace).not('approved_at','is',null).order('id').limit(31)) as Offer[];
 if(rows.length>30)throw new AppError(400,'Private AI currently supports up to 30 approved offers. Reduce the approved catalogue before generating.');
 return rows.map(o=>({name:o.name,description:o.description,price:rm(o.price_sen),terms:o.terms}));
}
