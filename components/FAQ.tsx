import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '../types';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'How long does setup take?',
      answer:
        'Initial setup takes about 10-15 minutes of your time. We build and train your AI agent within 2-3 business days, then you can go live immediately.',
    },
    {
      question: 'Do I need technical knowledge?',
      answer:
        'Not at all. Our team handles all the technical setup. You just tell us about your business, and we do the rest.',
    },
    {
      question: 'Can I cancel anytime?',
      answer:
        'Yes. All plans can be cancelled anytime. Your service remains active until the end of your current billing period.',
    },
    {
      question: 'What platforms do you support?',
      answer:
        'We support WhatsApp, Facebook Messenger, Instagram DMs, and custom website chat widgets. Enterprise plans include additional channels.',
    },
    {
      question: 'Will it sound robotic?',
      answer:
        'No. We train your AI to match your brand voice and speak naturally. Most customers can\'t tell they\'re talking to AI.',
    },
    {
      question: 'What if the AI can\'t answer a question?',
      answer:
        'The AI is smart enough to recognize when it needs human help. It will seamlessly hand off the conversation to you with full context.',
    },
    {
      question: 'How secure is my customer data?',
      answer:
        'Very secure. We\'re GDPR compliant, use end-to-end encryption, and never share your data with third parties.',
    },
    {
      question: 'Can I customize the responses?',
      answer:
        'Absolutely. You can update responses, add new products/services, and refine the AI\'s behavior anytime through our dashboard.',
    },
  ];

  return (
    <section id="faq" className="py-24 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-[900] text-slate-900 mb-4">
          Frequently asked questions
        </h2>
        <p className="text-xl text-slate-500">
          Everything you need to know about Lumo
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="glass-heavy overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-white/50 transition-colors"
            >
              <span className="font-bold text-slate-900 pr-8">{faq.question}</span>
              <ChevronDown
                size={20}
                className={`text-blue-600 flex-shrink-0 transition-transform ${
                  openIndex === idx ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-6 text-slate-600 leading-relaxed animate-slide-up">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center glass-heavy p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-3">
          Still have questions?
        </h3>
        <p className="text-slate-600 mb-6">
          Chat with us on WhatsApp and we'll help you out
        </p>
        <a
          href="https://wa.me/0123456789?text=Hi%20I%20have%20a%20question%20about%20Lumo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block btn-gloss"
        >
          Chat with us
        </a>
      </div>
    </section>
  );
}
