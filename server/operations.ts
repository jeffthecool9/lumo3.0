import {Router} from 'express';
import {z} from 'zod';
import {database,checked} from './db';
import {AppError} from './policy';
import {appointmentInput,appointmentPatch,defaultSettings,leadInput,leadPatch,settingsInput} from '../shared/operations';

export const operations=Router();
const leadFields='id,name,email,phone,interest,notes,stage,created_at,updated_at';
const appointmentFields='id,lead_id,service,resource,starts_at,ends_at,status,notes,created_at,updated_at';
const threadFields='id,lead_id,channel,status,handoff,subject,updated_at';
const id=(value:unknown)=>z.uuid().parse(value);
operations.get('/',async(_req,res,next)=>{
  try{
    const w=res.locals.workspace;
    const [leads,appointments,threads,connections,settings]=await Promise.all([
      checked(database().from('crm_leads').select(leadFields).eq('workspace_id',w).order('updated_at',{ascending:false}).limit(200)),
      checked(database().from('appointments').select(appointmentFields).eq('workspace_id',w).order('starts_at',{ascending:false}).limit(200)),
      checked(database().from('inbox_threads').select(threadFields).eq('workspace_id',w).order('updated_at',{ascending:false}).limit(200)),
      checked(database().from('channel_connections').select('id,channel,status,display_name,updated_at').eq('workspace_id',w)),
      checked(database().from('workspace_settings').select('industry,timezone').eq('workspace_id',w).maybeSingle()),
    ]);
    res.json({leads,appointments,threads,connections,settings:settings??defaultSettings});
  }catch(e){next(e);}
});
operations.post('/leads',async(req,res,next)=>{
  try{const input=leadInput.parse(req.body);res.status(201).json(await checked(database().from('crm_leads').insert({...input,workspace_id:res.locals.workspace}).select(leadFields).single()));}catch(e){next(e);}
});
operations.patch('/leads/:id',async(req,res,next)=>{
  try{const input=leadPatch.parse(req.body);const saved=await checked(database().from('crm_leads').update({...input,updated_at:new Date().toISOString()}).eq('workspace_id',res.locals.workspace).eq('id',id(req.params.id)).select(leadFields).maybeSingle());if(!saved)throw new AppError(404,'Lead not found.');res.json(saved);}catch(e){next(e);}
});
async function saveAppointment(query:PromiseLike<{data:any;error:any}>){
  const {data,error}=await query;
  if(error)throw new AppError(error.code==='P0001'?409:400,error.code==='P0001'?'This resource already has a confirmed appointment at that time.':'Appointment could not be saved. Check the lead and time range.');
  if(!data)throw new AppError(404,'Appointment not found.');return data;
}
operations.post('/appointments',async(req,res,next)=>{
  try{const input=appointmentInput.parse(req.body);res.status(201).json(await saveAppointment(database().from('appointments').insert({...input,workspace_id:res.locals.workspace}).select(appointmentFields).single()));}catch(e){next(e);}
});
operations.patch('/appointments/:id',async(req,res,next)=>{
  try{const input=appointmentPatch.parse(req.body);res.json(await saveAppointment(database().from('appointments').update(input).eq('workspace_id',res.locals.workspace).eq('id',id(req.params.id)).select(appointmentFields).maybeSingle()));}catch(e){next(e);}
});
operations.put('/settings',async(req,res,next)=>{
  try{const input=settingsInput.parse(req.body);await checked(database().from('workspace_settings').upsert({...input,workspace_id:res.locals.workspace}));res.json(input);}catch(e){next(e);}
});
operations.get('/threads/:id/messages',async(req,res,next)=>{
  try{const thread=id(req.params.id);const exists=await checked(database().from('inbox_threads').select('id').eq('workspace_id',res.locals.workspace).eq('id',thread).maybeSingle());if(!exists)throw new AppError(404,'Conversation not found.');const rows=await checked(database().from('inbox_messages').select('id,thread_id,direction,body,created_at,delivery').eq('workspace_id',res.locals.workspace).eq('thread_id',thread).order('created_at',{ascending:false}).limit(200));res.json(rows.reverse());}catch(e){next(e);}
});
operations.patch('/threads/:id',async(req,res,next)=>{
  try{const input=z.object({status:z.enum(['open','resolved']).optional(),handoff:z.literal(true).optional()}).strict().refine(v=>Object.keys(v).length>0).parse(req.body);const saved=await checked(database().from('inbox_threads').update({...input,updated_at:new Date().toISOString()}).eq('workspace_id',res.locals.workspace).eq('id',id(req.params.id)).select(threadFields).maybeSingle());if(!saved)throw new AppError(404,'Conversation not found.');res.json(saved);}catch(e){next(e);}
});
operations.post('/threads/:id/notes',async(req,res,next)=>{
  try{const thread=id(req.params.id);const {body}=z.object({body:z.string().trim().min(1).max(4000)}).strict().parse(req.body);const exists=await checked(database().from('inbox_threads').select('id').eq('workspace_id',res.locals.workspace).eq('id',thread).maybeSingle());if(!exists)throw new AppError(404,'Conversation not found.');res.status(201).json(await checked(database().from('inbox_messages').insert({workspace_id:res.locals.workspace,thread_id:thread,direction:'internal',body,delivery:'internal'}).select('id,thread_id,direction,body,created_at,delivery').single()));}catch(e){next(e);}
});
operations.post('/threads/:id/replies',(_req,_res,next)=>next(new AppError(503,'Customer messaging is not activated. No message was sent.')));
