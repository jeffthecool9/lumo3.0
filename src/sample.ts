import { type WorkspaceState, type PlanContent } from '../shared/schema';
import {appointmentDemoReply} from './demo-conversation';
import type {ConversationLanguage} from '../shared/localization';
export const samplePlan:PlanContent={
  title:'Studio Bloom Malaysian appointment flow',
  greeting:'Hi, welcome to Studio Bloom! Nak tanya tentang servis atau appointment? English, BM 或中文都可以。',
  questions:['Which service would you like? / Nak servis yang mana? / 请问想预约哪项服务？','What date and time would you prefer? / Nak tarikh dan pukul berapa? / 请问哪一天、几点方便？','Is there a preferred staff member? Ask only if relevant to this service.','May we have your name and contact number for follow-up? Ask permission and collect only missing details.','Read back the service, exact date, time in Malaysia, and contact details as an appointment request for team review.'],
  rules:['Match English, Bahasa Melayu, Chinese or natural mixing. Follow language switches; never infer language from a name. Be warm without forcing slang.','Ask one question at a time. Keep details already supplied when the customer switches language.','A haircut starts at RM65. Colour pricing needs a consultation. Do not invent deposits or other prices.','Open Tuesday to Sunday, 10am to 7pm, Malaysia time. Closed Mondays. Do not assume public-holiday hours.','Clarify ambiguous dates and repeat the exact date and time in Asia/Kuala_Lumpur before handoff.','Collect appointment preferences only. The team must confirm availability. Never claim a booking, reschedule, message or payment has been completed.'],
  fallback:'EN: Let our team check that first. / BM: Biar pasukan kami semak dahulu. / 中文：这个需要先由团队确认。 Use the customer\'s language and explain that this private test does not contact anyone.',
  handoff:['A customer asks for a human.','The customer requests a refund or makes a complaint.','A question requires a price or availability that has not been confirmed.'],
  leadFields:['Name','Contact number','Service of interest','Preferred date and Malaysia time','Preferred staff, if relevant','Conversation language'],
};
export function sampleState():WorkspaceState {
  return {workspace:{id:'sample',name:'Studio Bloom'},knowledge:{name:'Studio Bloom',business:'A neighbourhood hair studio in Kuala Lumpur. Haircuts start at RM65. Colour services require a consultation. Open Tuesday to Sunday, 10am to 7pm, Malaysia time. Closed Mondays.',faq:'Do you take walk-ins? Please ask our team for availability.\nBoleh book di sini? Kami catat masa pilihan anda; pasukan kami sahkan temujanji.\n可以预约吗？可以先记录意向，实际空档由团队确认。',language:'Malaysian mix',tone:'warm',handoff:'Collect the question in the customer\'s language for the team. Never confirm an appointment or claim a message was sent.'},
    plans:[{id:'sample-v1',version:1,content:structuredClone(samplePlan),approved_at:null,created_at:new Date().toISOString()}],
    billing:{status:'sample',tier:null,periodEnd:null,cancelAtEnd:false,review:false,trialUsed:false,access:false},usage:{plans:0,replies:0,costMicros:0}};
}
export function sampleReply(message:string,language:ConversationLanguage='Malaysian mix',previous=''){
  return appointmentDemoReply('salon',message,language,previous);
}
