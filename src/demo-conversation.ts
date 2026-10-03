import type {ConversationLanguage} from '../shared/localization';

type Locale = 'en' | 'ms' | 'zh' | 'mixed';
type Replies = Record<Locale, string>;

// Preset routing only. These examples never invoke AI or create appointments.
export function sampleLocale(message: string, language: ConversationLanguage = 'Malaysian mix', previous = ''): Locale {
  if (language === 'English') return 'en';
  if (language === 'Bahasa Melayu') return 'ms';
  if (language === 'Chinese') return 'zh';
  if (/\b(in english|english please|reply in english)\b|用英语|英文回复/i.test(message)) return 'en';
  if (/\b(bahasa melayu|dalam bm|reply in malay)\b|用马来语/i.test(message)) return 'ms';
  if (language === 'Malaysian mix' && /\b(in chinese|chinese please|mandarin)\b|用中文|中文回复/i.test(message)) return 'zh';
  const chinese = /[\u3400-\u9fff]/.test(message);
  const malay = /\b(boleh|nak|berapa|harga|temujanji|esok|sabtu|pukul|buka|tutup|saya|ada|petang|bila|caj|kawasan)\b/i.test(message);
  const english = /\b(hi|hello|book|booking|appointment|slot|available|price|how|much|saturday|tomorrow|please|pm|am|time|consultation)\b/i.test(message);
  if (chinese && language === 'Malaysian mix') return english || malay ? 'mixed' : 'zh';
  if (malay) return english ? 'mixed' : 'ms';
  if (english || /[a-z]{3}/i.test(message)) return 'en';
  return previous ? sampleLocale(previous, language) : 'en';
}

const booking: Replies = {
  en: 'I can help with an appointment request. What date and time would you prefer? Our team needs to check availability. This preset demo does not reserve a slot.',
  ms: 'Boleh. Tarikh dan pukul berapa yang anda nak? Pasukan kami perlu semak kekosongan dahulu. Demo ini tidak membuat tempahan.',
  zh: '可以先记录您的预约意向。请问您想预约哪一天、几点？需要由团队确认空档；这个示例不会实际预订。',
  mixed: 'Boleh, we can note your preferred slot. Nak tarikh dan pukul berapa? Our team needs to confirm availability first. This is a preset demo, not a confirmed booking.',
};
const chineseMixedBooking = '可以，先记录您的 preferred slot。请问想约哪一天、几点？团队需要先确认 availability；这个 demo 不会实际预订。';
const handoff: Replies = {
  en: 'This needs a person to review. In a live connected workspace, your team would handle the request. This preset demo cannot contact anyone or change an appointment.',
  ms: 'Permintaan ini perlu disemak oleh pasukan kami. Demo ini tidak menghubungi sesiapa atau mengubah temujanji.',
  zh: '这个请求需要由团队处理。此示例无法联系工作人员，也不会更改或取消预约。',
  mixed: 'Boleh, this needs our team to check. Demo ini tidak hantar mesej atau ubah booking. Nothing has been sent or changed.',
};
const fallback: Replies = {
  en: 'This is a fixed example, not live AI. Try asking about prices or appointment requests, in English, Bahasa Melayu, Chinese or a mix. No booking will be made.',
  ms: 'Ini contoh jawapan tetap, bukan AI langsung. Cuba tanya harga atau permintaan temujanji. Tiada tempahan dibuat dalam demo ini.',
  zh: '这是预设示例，不是实时 AI。可以试着询问价格或预约，也可以使用中文、英文、马来文或混合语言。此处不会实际预订。',
  mixed: 'This is a preset demo, bukan live AI. Boleh cuba tanya harga or appointment requests. No actual booking will be made.',
};
const prices: Record<string, Replies> = {
  salon: {
    en: 'In this example, haircuts start from RM65. Colour needs a consultation before the team confirms a price. Which service are you interested in?',
    ms: 'Dalam contoh ini, potong rambut bermula dari RM65. Harga pewarnaan perlu konsultasi dahulu. Anda berminat dengan servis yang mana?',
    zh: '在这个示例中，剪发 RM65 起。染发需要先咨询，由团队确认价格。请问您想了解哪项服务？',
    mixed: 'Haircut starts from RM65 in this example. Kalau colour, our team needs a consultation before confirming the price. Nak service yang mana?',
  },
  home: {
    en: 'The quote depends on the property and scope of work. Is it an apartment or a house? The team will confirm the price before any booking.',
    ms: 'Harga bergantung pada jenis rumah dan kerja yang diperlukan. Rumah anda apartmen atau rumah teres? Pasukan kami akan sahkan harga dahulu.',
    zh: '报价取决于房屋类型和清洁范围。请问是公寓还是排屋？团队确认报价后才能安排预约。',
    mixed: 'Price depends on your property and scope. Rumah apartment or landed? Our team will confirm the quote before any booking.',
  },
  shop: {
    en: 'The team will confirm consultation fees and product prices. What would you like to discuss during your showroom visit?',
    ms: 'Pasukan kami akan sahkan caj konsultasi dan harga produk. Apa yang anda ingin bincangkan semasa lawatan ke ruang pameran?',
    zh: '咨询费用和产品价格需要由团队确认。请问您到展示厅想了解什么？',
    mixed: 'Our team will confirm fees and pricing first. Nak discuss apa during your showroom consultation?',
  },
};
const hours: Replies = {
  en: 'The sample studio opens Tuesday to Sunday, 10am to 7pm, Malaysia time. Mondays are closed. Appointment availability still needs team confirmation.',
  ms: 'Studio contoh dibuka Selasa hingga Ahad, 10 pagi hingga 7 malam, waktu Malaysia. Isnin tutup. Kekosongan temujanji perlu disahkan oleh pasukan kami.',
  zh: '示例工作室营业时间为星期二至星期日，上午10点至晚上7点，马来西亚时间；星期一休息。预约空档仍需要团队确认。',
  mixed: 'Open Tuesday to Sunday, 10am to 7pm Malaysia time. Isnin tutup. For an appointment slot, our team will confirm first.',
};
const coverage: Replies = {
  en: 'This sample service covers Kuala Lumpur. Which area or postcode is the visit for? The team must confirm coverage for your location.',
  ms: 'Servis contoh ini meliputi Kuala Lumpur. Kawasan atau poskod mana? Pasukan kami perlu sahkan liputan lokasi anda.',
  zh: '示例服务范围是吉隆坡。请问您在哪个地区，邮编是什么？团队需要确认您的地点是否在服务范围内。',
  mixed: 'We serve Kuala Lumpur in this example. Area mana, or what postcode? Our team will confirm coverage before a visit.',
};

export function appointmentDemoReply(id: string, message: string, language: ConversationLanguage = 'Malaysian mix', previous = '') {
  const locale = sampleLocale(message, language, previous);
  if (/\b(human|person|staff|cancel|reschedule|refund|complaint|batal|tukar|aduan)\b|人工|取消|改期|退款|投诉/i.test(message)) return handoff[locale];
  if (/\b(price|cost|much|quote|harga|caj|fees)\b|多少钱|价格|收费|价钱|几钱/i.test(message)) {
    if (locale === 'mixed' && /[\u3400-\u9fff]/.test(message)) return (prices[id] ?? prices.shop).zh;
    return (prices[id] ?? prices.shop)[locale];
  }
  if (/\b(book|booking|appointment|consultation|slot|available|saturday|tomorrow|temujanji|esok|sabtu)\b|预约|预订|空位|星期|明天|周六/i.test(message)) return locale === 'mixed' && /[\u3400-\u9fff]/.test(message) ? chineseMixedBooking : booking[locale];
  if (id === 'salon' && /\b(open|hours|close|buka|tutup|bila)\b|营业|几点开|几点关/i.test(message)) return hours[locale];
  if (id === 'home' && /\b(cover|location|kuala|area|kawasan|poskod)\b|地区|范围|吉隆坡/i.test(message)) return coverage[locale];
  return fallback[locale];
}
const objections: Replies = {
  en: 'I understand you want to compare the value. I can explain the approved options, but cannot invent a discount. What matters most to you when choosing?',
  ms: 'Faham, anda nak bandingkan nilainya. Saya boleh jelaskan pilihan yang disahkan, tetapi tidak boleh reka diskaun. Apa yang paling penting bagi anda?',
  zh: '明白，您想比较是否值得。我可以说明已确认的选择，但不能随意承诺折扣。您选择时最在意什么？',
  mixed: 'Faham, you want to compare value. 我们可以说明已确认的选择, but cannot promise a discount. What matters most to you?',
};
const quoteRequests: Replies = {
  en: 'I can help you prepare a quote request. What product or service do you need? Your team would review the details in a connected service; this demo saves no lead.',
  ms: 'Boleh sediakan permintaan sebut harga. Produk atau servis apa yang anda perlukan? Pasukan perlu semak butiran; demo ini tidak menyimpan lead.',
  zh: '可以先整理报价需求。请问您需要哪种产品或服务？正式服务需要团队确认；这个示例不会保存潜在客户记录。',
  mixed: 'Boleh, let us understand the quote request first. 您需要什么 product or service? The team checks the details; this demo saves no lead.',
};
const purchaseRequests: Replies = {
  en: 'What product or service would you like to buy? A connected agent would use an approved purchase link or pass the details to your team. This demo cannot place an order or take payment.',
  ms: 'Produk atau servis apa yang anda ingin beli? Ejen yang disambungkan perlu guna pautan pembelian yang disahkan atau rujuk pasukan. Demo ini tidak membuat pesanan atau menerima bayaran.',
  zh: '请问您想购买哪种产品或服务？正式连接后需要使用已确认的购买链接，或由团队处理。此示例不会下单或收款。',
  mixed: 'Boleh. Which product or service would you like? 购买需要已确认的链接或团队处理. This demo cannot place an order or take payment.',
};
const productPrice: Replies = {
  en: 'The illustrative canvas tote is RM129. Stock and delivery need team confirmation. What would you like to use it for?',
  ms: 'Beg tote kanvas dalam contoh ini berharga RM129. Stok dan penghantaran perlu disahkan oleh pasukan. Anda nak guna untuk apa?',
  zh: '示例中的帆布袋是 RM129。库存和配送需要团队确认。请问您打算用来做什么？',
  mixed: 'The sample canvas tote is RM129. Stok and delivery need team confirmation. 您打算用来做什么？',
};
const salesFallback: Replies = {
  en: 'What are you looking for, and what matters most when choosing? This is a preset sales example; it cannot save a lead, contact your team or complete a sale.',
  ms: 'Anda mencari apa, dan apa yang penting semasa memilih? Ini contoh jualan tetap; ia tidak menyimpan lead, menghubungi pasukan atau menyelesaikan jualan.',
  zh: '请问您在找什么，选择时最在意什么？这是预设销售示例，不会保存客户记录、联系团队或完成销售。',
  mixed: 'Nak cari apa, and what matters most? 您可以自然混合语言. This preset demo cannot save a lead or complete a sale.',
};

export function salesDemoReply(id: string, message: string, language: ConversationLanguage = 'Malaysian mix', previous = '') {
  const locale = sampleLocale(message, language, previous);
  if (/\b(human|person|staff|cancel|reschedule|refund|complaint|batal|tukar|aduan)\b|人工|取消|改期|退款|投诉/i.test(message)) return appointmentDemoReply(id,message,language,previous);
  if (/\b(expensive|mahal|discount|cheaper|alternatives)\b|贵|折扣|便宜|别的选择/i.test(message)) return objections[locale];
  if (/\b(quote|quotation|sebut harga)\b|报价/i.test(message)) return quoteRequests[locale];
  if (/\b(buy|purchase|order|beli|checkout)\b|购买|下单/i.test(message)) return purchaseRequests[locale];
  if (id === 'shop' && /\b(price|cost|much|harga|caj|fees)\b|多少钱|价格|收费|价钱|几钱/i.test(message)) return productPrice[locale];
  const response = appointmentDemoReply(id,message,language,previous);
  return response === fallback[locale] ? salesFallback[locale] : response;
}
