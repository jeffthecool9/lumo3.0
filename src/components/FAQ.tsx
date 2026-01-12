import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { FAQItem } from "./types";

const faqs: FAQItem[] = [
  {
    question: "Is this a bot? Will it sound robotic?",
    answer:
      "We don’t use basic keyword bots. We build custom conversational flows based on your business and your past chats — so it sounds like a real sales admin using your tone (casual or formal).",
  },
  {
    question: "Can I still take over the chat if I want?",
    answer:
      "Yes. You can jump into any conversation anytime. Once you start typing, the Lumo flow pauses instantly so you can handle the customer personally.",
  },
  {
    question: "I’m not tech-savvy. How much work is it for me?",
    answer:
      "Almost zero. This is Done-For-You: we analyze your needs, build the flow, and set everything up. You just receive ready-to-buy leads.",
  },
  {
    question: "What happens if a customer asks something complicated?",
    answer:
      "The system handles the repetitive stuff. For complex questions, it flags you to step in — so you only spend time on high-value conversations.",
  },
  {
    question: "Are there any recurring monthly software fees?",
    answer:
      "Yes — there is a recurring monthly fee for ongoing system maintenance and support.",
  },
 {
  question: "Are there any recurring monthly software fees?",
  answer: "Yes, there is a recurring monthly fee for system maintenance & management fee for fixing heavy issues."
},
{
  question: "Is it refundable?",
  answer: "No. You can cancel the subscription recurring fee only. You are still able to access with the flow for a lifetime, but without any assistance in changing the setups."
}

];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-slate-400">
            FAQ
          </p>
          <h2 className="mt-4 text-3xl md:text-5xl font-[900] tracking-tight text-slate-900">
            Common Questions
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Clear answers, no fluff. If you still have questions, WhatsApp us.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-md shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-6 p-6 md:p-7 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                >
                  <span className="text-slate-900 font-extrabold text-base md:text-lg tracking-tight">
                    {item.question}
                  </span>
                  <span className="shrink-0 w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>

                <div
                  className={`px-6 md:px-7 pb-6 md:pb-7 text-slate-600 leading-relaxed transition-all duration-300 ${
                    isOpen ? "block" : "hidden"
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
