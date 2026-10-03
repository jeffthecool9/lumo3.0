import { type WorkspaceState, type PlanContent } from '../shared/schema';
import {salesDemoReply} from './demo-conversation';
import type {ConversationLanguage} from '../shared/localization';
export const samplePlan:PlanContent={
  title:'Studio Bloom Malaysian sales flow',
  greeting:'Hi, welcome to Studio Bloom! Nak explore service apa? English, BM 或中文都可以。',
  questions:['What result are you looking for? / Nak hasil macam mana? / 您希望达到什么效果？','Which approved service fits that need? Explain verified options before asking another question.','What matters most: the result, your budget or when you need it? Ask only the missing, relevant detail.','Would you like a team-reviewed quote or a consultation? Offer appointments only when useful.','May we have your name and contact number for follow-up? Ask permission, then summarise the need and agreed next step as a request.'],
  rules:['Match English, Bahasa Melayu, Chinese or natural mixing. Follow language switches; never infer language from a name. Be warm without forcing slang.','Ask one question at a time. Keep details already supplied when the customer switches language.','A haircut starts at RM65. Colour pricing needs a consultation. Do not invent deposits or other prices.','Open Tuesday to Sunday, 10am to 7pm, Malaysia time. Closed Mondays. Do not assume public-holiday hours.','Clarify ambiguous dates and repeat the exact date and time in Asia/Kuala_Lumpur before handoff.','Qualify the need and buying timeline. Handle price objections with approved facts, without inventing discounts or pressuring the customer. Appointments are optional. The team must confirm quotes and availability. Never claim a lead, booking, order, message or payment was completed in private testing.'],
  fallback:'EN: Let our team check that first. / BM: Biar pasukan kami semak dahulu. / 中文：这个需要先由团队确认。 Use the customer\'s language and explain that this private test does not contact anyone.',
  handoff:['A customer asks for a human.','The customer requests a refund or makes a complaint.','A question requires a price or availability that has not been confirmed.'],
  leadFields:['Name with consent','Contact number with consent','Service of interest','Buying goal','Budget if volunteered','Purchase timing','Agreed next step','Conversation language'],
};
export function sampleState():WorkspaceState {
  return {workspace:{id:'sample',name:'Studio Bloom'},knowledge:{name:'Studio Bloom',business:'A neighbourhood hair studio in Kuala Lumpur. Haircuts start at RM65. Colour services require a consultation. Open Tuesday to Sunday, 10am to 7pm, Malaysia time. Closed Mondays.',faq:'How much is a haircut? Haircuts start at RM65. Colour quotes need consultation.\nAda diskaun? Jangan janji diskaun yang belum disahkan.\n可以报价吗？染发需要先咨询，报价由团队确认。',language:'Malaysian mix',tone:'warm',handoff:'Collect the buying need and agreed next step in the customer\'s language for team review. Never confirm a sale, booking or sent message.'},
    plans:[{id:'sample-v1',version:1,content:structuredClone(samplePlan),approved_at:null,created_at:new Date().toISOString()}],
    billing:{status:'sample',tier:null,periodEnd:null,cancelAtEnd:false,review:false,trialUsed:false,access:false},usage:{plans:0,replies:0,costMicros:0}};
}
export function sampleReply(message:string,language:ConversationLanguage='Malaysian mix',previous=''){
  return salesDemoReply('salon',message,language,previous);
}
