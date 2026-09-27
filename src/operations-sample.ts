import {defaultSettings,type InboxMessage,type OperationsState} from '../shared/operations';
export function sampleOperations():OperationsState{
  const now=new Date(),stamp=now.toISOString();
  const start=new Date(now);start.setUTCDate(start.getUTCDate()+1);start.setUTCHours(3,0,0,0);
  return {settings:defaultSettings,connections:[],
    leads:[
      {id:'10000000-0000-4000-8000-000000000001',name:'Aina (sample)',email:'',phone:'',interest:'Hair colour consultation',notes:'Prefers a weekend appointment. Fictional sample lead.',stage:'new',created_at:stamp,updated_at:stamp},
      {id:'10000000-0000-4000-8000-000000000002',name:'Mei (sample)',email:'',phone:'',interest:'Haircut',notes:'Returning customer. Fictional sample lead.',stage:'qualified',created_at:stamp,updated_at:stamp},
      {id:'10000000-0000-4000-8000-000000000003',name:'Daniel (sample)',email:'',phone:'',interest:'Scalp treatment',notes:'Asked for pricing. Fictional sample lead.',stage:'follow_up',created_at:stamp,updated_at:stamp},
    ],
    appointments:[{id:'20000000-0000-4000-8000-000000000001',lead_id:'10000000-0000-4000-8000-000000000002',service:'Haircut',resource:'Main chair',starts_at:start.toISOString(),ends_at:new Date(start.getTime()+3600000).toISOString(),status:'requested',notes:'Time preference only. Awaiting staff confirmation.',created_at:stamp,updated_at:stamp}],
    threads:[{id:'30000000-0000-4000-8000-000000000001',lead_id:'10000000-0000-4000-8000-000000000001',channel:'whatsapp',status:'open',handoff:true,subject:'Colour consultation for Saturday',updated_at:stamp},{id:'30000000-0000-4000-8000-000000000002',lead_id:'10000000-0000-4000-8000-000000000003',channel:'web',status:'open',handoff:false,subject:'Scalp treatment pricing',updated_at:stamp}],
  };
}
export function sampleMessages(thread:string):InboxMessage[]{
  const first=thread.endsWith('1');
  return [{id:`${thread}-1`,thread_id:thread,direction:'inbound',body:first?'Hi, nak book consultation this Saturday, boleh?':'Hi, 请问 scalp treatment 多少钱？',delivery:'received',created_at:new Date().toISOString()},
    {id:`${thread}-2`,thread_id:thread,direction:'outbound',body:first?'Boleh. Pukul berapa yang sesuai? Our team will check availability first.':'这个需要团队确认项目和价格。Would you like a follow-up? This is a sample only.',delivery:'sent',created_at:new Date().toISOString()}];
}
