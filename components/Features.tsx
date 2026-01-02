import React from "react";
import { Clock, Filter, TrendingUp } from "lucide-react";

type Benefit = {
  title: string;
  description: string;
  Icon: React.ElementType;
};

const benefits: Benefit[] = [
  {
    title: "Zero-Wait Response",
    description:
      "Reply to customers at 2 AM automatically. Speed is your only real competitive advantage in a crowded market.",
    Icon: Clock,
  },
  {
    title: "Filter Serious Buyers",
    description:
      "Qualified leads are handed to you, while 'PM price' noise is handled silently and professionally by Lumo.",
    Icon: Filter,
  },
  {
    title: "Recover Revenue",
    description:
      "50% of sales go to the first vendor to reply. We make sure that's always your business, every single time.",
    Icon: TrendingUp,
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Monolith for consistency */}
        <div className="flex flex-col items-center mb-16">
          <div className="glass-monolith px-10 py-12 md:px-20 md:py-16 text-center max-w-4xl w-full">
            <div className="inline-block mb-5">
              <span className="text-[11px] font-[600] text-slate-400 uppercase tracking-[0.4em]">
                Focused Outcomes
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-[800] text-[#0F172A] tracking-tighter leading-[1.1]">
              How Lumo Helps You Grow
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.Icon;
            return (
              <div
                key={idx}
                className="
                  group
                  flex items-start gap-6
                  rounded-[2.5rem]
                  p-10
                  bg-white
                  border border-slate-200/70
                  shadow-[0_20px_50px_rgba(15,23,42,0.08)]
                  hover:shadow-[0_30px_80px_rgba(15,23,42,0.12)]
                  transition-all duration-500
                "
              >
                <div
                  className="
                    flex-shrink-0
                    w-14 h-14
                    rounded-2xl
                    bg-blue-50
                    flex items-center justify-center
                    group-hover:bg-blue-100
                    transition-colors
                  "
                >
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {benefit.title}
                  </h4>
                  <p className="text-slate-600 text-base leading-relaxed font-medium">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};