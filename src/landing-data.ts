import {Scissors,House,ShoppingBag} from 'lucide-react';

export const businesses=[
  {id:'salon',label:'Salons & spas',name:'Studio Bloom',category:'BEAUTY & WELLNESS',icon:Scissors,color:'sage',image:'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85',alt:'A bright hair salon with styling chairs and mirrors',headline:'A warm welcome. Before the appointment.',description:'Service questions, treatment enquiries, and appointment preferences, all in your voice.',prompt:'I run a hair salon in Kuala Lumpur. Help customers choose a service, answer our FAQs, and collect appointment preferences for our team to confirm.',greeting:'Hi, welcome to Studio Bloom! Looking for a fresh cut, a colour, or a little advice?',questions:['How much is a haircut?','Can I book for Saturday?','What are your opening hours?'],fact:'Haircuts from RM65. Tuesday to Sunday, 10am - 7pm. The team confirms appointments.'},
  {id:'home',label:'Home services',name:'Fresh Space',category:'HOME & LOCAL SERVICES',icon:House,color:'sky',image:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85',alt:'A bright contemporary living room prepared for a home cleaning service',headline:'Get the details. Give the right quote.',description:'Understand the property, location, and job before your team follows up.',prompt:'I run a home cleaning service. Ask about the property type, location, number of rooms, and preferred date. Collect the details our team needs to prepare a quote.',greeting:'Hello from Fresh Space! Tell me a little about the home you would like us to clean.',questions:['How much does cleaning cost?','Do you cover Kuala Lumpur?','Can I book a cleaning?'],fact:'Serving Kuala Lumpur. Quotes depend on the property and scope. The team confirms every booking.'},
  {id:'shop',label:'Online shops',name:'Everyday Goods',category:'RETAIL & E-COMMERCE',icon:ShoppingBag,color:'rose',image:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85',alt:'A clothing shop with thoughtfully arranged garments and natural light',headline:'Every question is a buying moment.',description:'Help shoppers understand delivery and returns, and pass order questions to your team.',prompt:'I run an online shop. Answer questions about delivery and returns using our policies, help customers find what they need, and hand order-specific questions to our team.',greeting:'Welcome to Everyday Goods! How can I help with your shopping today?',questions:['How long does delivery take?','What is your return policy?','Can you check my order?'],fact:'Sample policy: delivery in 3-5 business days. Returns within 14 days for unused items. Order details are handled by the team.'}
] as const;

export function demoReply(id:string,message:string){
  const text=message.toLowerCase();
  if(id==='salon'){
    if(/price|cost|much|haircut|cut/.test(text))return 'Haircuts at Studio Bloom start from RM65. Colour services need a consultation so the team can give you an accurate price. Which service are you interested in?';
    if(/book|saturday|appointment|tomorrow/.test(text))return 'Happy to help with an appointment request. Which service and time would you prefer? The salon team will check availability and confirm with you. This demo does not make a booking.';
    if(/hour|open|close|time/.test(text))return 'We are open Tuesday to Sunday, 10am to 7pm, and closed on Mondays. Is there a service you would like to know more about?';
  }
  if(id==='home'){
    if(/price|cost|much|quote/.test(text))return 'The quote depends on your property and the cleaning you need. Is it an apartment or a house, and how many rooms would you like cleaned? Our team will confirm the price.';
    if(/cover|location|kuala|area/.test(text))return 'Fresh Space serves Kuala Lumpur. Which neighbourhood is your property in? Our team can confirm coverage for your address.';
    if(/book|clean|date|tomorrow/.test(text))return 'Let us start with your property type, number of rooms, and preferred date. Our team will then confirm the quote and availability. This demo does not make a booking.';
  }
  if(id==='shop'){
    if(/deliver|ship|long/.test(text))return 'Our sample delivery time is 3-5 business days. For an update on a specific order, the team can help once they have your order reference.';
    if(/return|refund/.test(text))return 'Our sample policy allows returns within 14 days for unused items. Would you like the team to help with a particular item? They will confirm eligibility.';
    if(/order|check|track/.test(text))return 'I can pass your question to the team. Please have your order reference ready. This demo is not connected to an order system, so it cannot retrieve your order details.';
  }
  if(/human|person|team/.test(text))return 'That is a good moment for a human handoff. In your own chatbot, this is where your team would receive the enquiry. This sample does not contact anyone.';
  return 'This is a preset demo conversation. Try one of the suggested questions to see the example, or start your own chatbot brief above. Your own chatbot will use the business knowledge you provide.';
}
