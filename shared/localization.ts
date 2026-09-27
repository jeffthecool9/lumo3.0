export const conversationLanguages = ['Malaysian mix', 'English', 'Bahasa Melayu', 'Chinese', 'English + Bahasa Melayu'] as const;
export type ConversationLanguage = typeof conversationLanguages[number];
export const languageLabels: Record<ConversationLanguage, string> = {
  'Malaysian mix': 'Auto-match: English, BM & 中文',
  English: 'English',
  'Bahasa Melayu': 'Bahasa Melayu',
  Chinese: '中文 (Chinese)',
  'English + Bahasa Melayu': 'English + Bahasa Melayu',
};
export const conversationTones = ['warm', 'professional'] as const;
export type ConversationTone = typeof conversationTones[number];
export const toneLabels: Record<ConversationTone, string> = {warm: 'Warm & conversational', professional: 'Polished & professional'};

export const appointmentBriefs = [
  {id: 'consultation', label: 'Consultations', prompt: 'I run an appointment-based business in Malaysia. Help customers enquire about a consultation, then collect the service, preferred branch or staff member, date, time and contact details, one question at a time. Match English, Bahasa Melayu, Chinese or a natural mix. Use only my saved business facts and RM prices. Confirm the exact date and Malaysia time; a person must check availability before confirming a booking.'},
  {id: 'visit', label: 'On-site visits', prompt: 'I run a Malaysian business with appointments at customer locations. Ask what service they need, their area or postcode, and their preferred date and time. Match the customer\'s English, Bahasa Melayu, Chinese or mixed-language style. Ask only for details needed for the visit. Let my team confirm coverage, the quote and the slot; never invent availability or take payment.'},
  {id: 'session', label: 'Classes & sessions', prompt: 'I run scheduled classes or one-to-one sessions in Malaysia. Help customers choose a session using my saved knowledge, ask their preferred date, time and number of attendees, then collect contact details with permission. Reply naturally in English, Bahasa Melayu, Chinese or their mix. Show confirmed prices in RM and clarify dates in Malaysia time. My team confirms space before a booking is accepted.'},
] as const;
