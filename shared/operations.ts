import {z} from 'zod';

export const leadStages=['new','qualified','follow_up','won','lost'] as const;
export const appointmentStatuses=['requested','confirmed','completed','cancelled'] as const;
const leadFields=z.object({
  name:z.string().trim().min(1).max(100),email:z.union([z.email().max(254),z.literal('')]),
  phone:z.string().trim().max(30),interest:z.string().trim().max(200),
  notes:z.string().trim().max(2000),stage:z.enum(leadStages),
}).strict();
export const leadInput=leadFields.extend({email:leadFields.shape.email.default(''),phone:leadFields.shape.phone.default(''),interest:leadFields.shape.interest.default(''),notes:leadFields.shape.notes.default(''),stage:leadFields.shape.stage.default('new')});
export const leadPatch=leadFields.partial().refine(v=>Object.keys(v).length>0);
export const appointmentInput=z.object({
  lead_id:z.uuid(),service:z.string().trim().min(1).max(120),resource:z.string().trim().min(1).max(80),
  starts_at:z.iso.datetime({offset:true}),ends_at:z.iso.datetime({offset:true}),
  status:z.enum(appointmentStatuses).default('requested'),notes:z.string().trim().max(1000).default(''),
}).strict().refine(v=>Date.parse(v.ends_at)>Date.parse(v.starts_at)&&Date.parse(v.ends_at)-Date.parse(v.starts_at)<=86400000,{message:'The end must be after the start, within 24 hours.'});
export const appointmentPatch=z.object({status:z.enum(appointmentStatuses)}).strict();
export const settingsInput=z.object({industry:z.enum(['beauty','home_services','retail','other']),timezone:z.string().refine(v=>{try{new Intl.DateTimeFormat('en',{timeZone:v});return true;}catch{return false;}},'Choose a supported time zone.')}).strict();
export type Lead= z.infer<typeof leadInput>&{id:string;created_at:string;updated_at:string};
export type Appointment=z.infer<typeof appointmentInput>&{id:string;created_at:string;updated_at:string};
export type WorkspaceSettings=z.infer<typeof settingsInput>;
export interface InboxThread{id:string;lead_id:string;channel:'whatsapp'|'web';status:'open'|'resolved';handoff:boolean;subject:string;updated_at:string}
export interface InboxMessage{id:string;thread_id:string;direction:'inbound'|'outbound'|'internal';body:string;created_at:string;delivery:'received'|'sent'|'failed'|'internal'}
export interface ChannelConnection{id:string;channel:'whatsapp'|'web';status:'disconnected'|'pending'|'connected'|'error';display_name:string;updated_at:string}
export interface OperationsState{leads:Lead[];appointments:Appointment[];threads:InboxThread[];connections:ChannelConnection[];settings:WorkspaceSettings}
export const defaultSettings:WorkspaceSettings={industry:'beauty',timezone:'Asia/Kuala_Lumpur'};
export function appointmentConflict(items:Appointment[],candidate:Pick<Appointment,'id'|'resource'|'starts_at'|'ends_at'|'status'>){
  return candidate.status==='confirmed'&&items.some(a=>a.id!==candidate.id&&a.status==='confirmed'&&a.resource.toLowerCase()===candidate.resource.toLowerCase()&&Date.parse(a.starts_at)<Date.parse(candidate.ends_at)&&Date.parse(a.ends_at)>Date.parse(candidate.starts_at));
}
