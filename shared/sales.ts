import {z} from 'zod';
export const offerInput=z.object({name:z.string().trim().min(1).max(120),description:z.string().trim().max(1000),price_sen:z.number().int().min(0).max(100000000),terms:z.string().trim().max(1000)}).strict();
export const followupInput=z.object({lead_id:z.uuid(),title:z.string().trim().min(1).max(200),due_at:z.iso.datetime({offset:true}),notes:z.string().trim().max(1000)}).strict();
export const followupPatch=z.object({status:z.enum(['pending','completed','cancelled'])}).strict();
export const offerApproval=z.object({expected_updated_at:z.iso.datetime({offset:true})}).strict();
export type Offer=z.infer<typeof offerInput>&{id:string;approved_at:string|null;updated_at:string};
export type Followup=z.infer<typeof followupInput>&{id:string;status:'pending'|'completed'|'cancelled';updated_at:string};
export interface SalesState {offers:Offer[];followups:Followup[];leads:{id:string;name:string}[]}
export const rm=(sen:number)=>`RM ${(sen/100).toFixed(2)}`;
export function priceToSen(value:string){if(!/^\d+(\.\d{1,2})?$/.test(value))throw new Error('Enter a valid RM price with up to two decimal places.');const [whole,fraction='']=value.split('.');const sen=Number(whole)*100+Number(fraction.padEnd(2,'0'));return offerInput.shape.price_sen.parse(sen);}
