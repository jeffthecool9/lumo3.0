import { type WorkspaceState, type PlanContent } from '../shared/schema';
export const samplePlan:PlanContent={
  title:'Studio Bloom enquiry assistant',
  greeting:'Hi, welcome to Studio Bloom! What can I help you with today: a haircut, colour, or a treatment?',
  questions:['Which service are you interested in?','Do you have a preferred day and time?','May I have your name and contact number for the team to follow up?'],
  rules:['A haircut starts at RM65. Colour pricing needs a consultation.','Open Tuesday to Sunday, 10am to 7pm. Closed Mondays.','Collect appointment preferences only. The team must confirm availability.'],
  fallback:'I do not have that information yet. I can collect your question for the Studio Bloom team.',
  handoff:['A customer asks for a human.','The customer requests a refund or makes a complaint.','A question requires a price or availability that has not been confirmed.'],
  leadFields:['Name','Contact number','Service of interest','Preferred day and time'],
};
export function sampleState():WorkspaceState {
  return {workspace:{id:'sample',name:'Studio Bloom'},knowledge:{name:'Studio Bloom',business:'A neighbourhood hair studio in Kuala Lumpur. Haircuts start at RM65. Colour services require a consultation. Open Tuesday to Sunday, 10am to 7pm. Closed Mondays.',faq:'Do you take walk-ins? Please ask our team for availability.\nCan I book here? We collect your preferred time; our team confirms every appointment.',language:'English + Bahasa Melayu',handoff:'Collect the question for the salon team. Never confirm an appointment.'},
    plans:[{id:'sample-v1',version:1,content:structuredClone(samplePlan),approved_at:null,created_at:new Date().toISOString()}],
    billing:{status:'sample',tier:null,periodEnd:null,cancelAtEnd:false,review:false,trialUsed:false,access:false},usage:{plans:0,replies:0,costMicros:0}};
}
export function sampleReply(message:string){
  if(/price|cost|haircut|how much/i.test(message))return 'In this sample, a haircut at Studio Bloom starts at RM65. Colour pricing requires a consultation. Which service interests you?';
  if(/open|hour|monday|time/i.test(message))return 'The sample studio is open Tuesday to Sunday, 10am to 7pm, and closed on Mondays.';
  if(/book|appointment|tomorrow/i.test(message))return 'I can collect your preferred day and time. The salon team would need to confirm availability. This sample does not create a booking.';
  return 'This is a fixed sample response, not a live AI answer. Try asking about haircut prices, opening hours, or appointments. Your own assistant becomes available after verified checkout and service setup.';
}
