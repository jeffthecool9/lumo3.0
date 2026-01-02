import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { FAQItem } from '../types';

const faqs: FAQItem[] = [
  {
    question: "Is this a bot? Will it sound robotic?",
    answer: "We don't use basic keyword bots. We build custom conversational flows based on your past chats. It sounds like a professional sales admin using your specific tone, whether that's casual or formal."
  },
  {
    question: "Can I still take over the chat if I want?",
    answer: "Absolutely. You can jump into any conversation at any time. When you start typing, the Lumo flow pauses instantly to let you handle the customer personally. It's designed to assist you, not replace you."
  },
  {
    question: "I'm not tech-savvy. How much work is it for me?",
    answer: "Zero. This is a Done-For-You service. We analyze your requirements, build the flow, and set everything up. You just continue receiving ready-to-buy leads on your phone."
  },
  {
    question: "What happens if a customer asks something complicated?",
    answer: "The flow is built to handle 80% of repetitive noise. If someone asks a complex or custom question, the system can automatically flag it for your attention so you only spend time on high-value conversations."
  },
  {
    question: "Are there any recurring monthly software fees?",
    answer: "No. We focus on one-time setup packages. You pay once for the custom build, and that's it. We believe business owners have enough subscriptions already."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-12 relative z-10 bg-transparent">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-50 border border-blue-200 shadow-sm mb-6">
            <HelpCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tight">Got Questions?</h2>
          <p className="text-slate-700 font-black uppercase tracking-widest text-[11px]">Clear answers for business owners.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className={`bg-[#F0EEE9]/70 backdrop-blur-xl rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === idx ? 'border-blue-600 shadow-xl shadow-blue-500/5' : 'border-slate-300'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <span className={`text-sm font-black tracking-tight transition-colors ${openIndex === idx ? 'text-blue-800' : 'text-slate-900 group-hover:text-blue-600'}`}>
                  {faq.question}
                </span>
                <div className={`transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}>
                   {openIndex === idx ? (
                     <Minus size={18} className="text-blue-600 flex-shrink-0" />
                   ) : (
                     <Plus size={18} className="text-slate-600 flex-shrink-0" />
                   )}
                </div>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-slate-800 leading-relaxed text-[13px] font-bold border-t border-slate-300 mt-1">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};