import React, { useState, useEffect } from 'react';

interface Testimonial {
  company: string;
  quote: string;
  author: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    company: "Flexi Design Sdn Bhd",
    quote: "Lumo filters the noise 'kau-kau'. Only serious leads get passed to my designers. We focus on big projects now.",
    author: "Jason",
    role: "Project Director"
  },
  {
    company: "Wong & Lim Aircond",
    quote: "Technician no longer needs to answer calls mid-service. Everything auto-settle. Very steady system.",
    author: "Mr. Wong",
    role: "Business Owner"
  },
  {
    company: "Elina Hijab Co.",
    quote: "Handles size checking and postage info A-Z. Customer happy fast reply, sales pun masuk.",
    author: "Pn. Elina",
    role: "Founder"
  }
];

export const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 relative">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Unified Monolith Header Section */}
        <div className="flex flex-col items-center mb-16">
          <div className="glass-monolith px-10 py-12 md:px-20 md:py-16 text-center max-w-4xl w-full">
            <div className="inline-block mb-5">
            
            </div>
            <h2 className="text-3xl md:text-5xl font-[800] text-[#0F172A] tracking-tighter leading-[1.1]">
              Trusted by Malaysian SMEs
            </h2>
          </div>
        </div>
        
        <div className="relative h-[320px] md:h-[280px]"> 
          {testimonials.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
                index === activeIndex 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-12 scale-95 pointer-events-none'
              }`}
            >
              <div className="bg-white rounded-[3.5rem] p-12 md:p-16 border border-slate-50 shadow-sm text-center">
                <p className="text-xl md:text-2xl text-[#0F172A] font-semibold tracking-tight leading-relaxed italic mb-10 max-w-3xl mx-auto">
                  "{item.quote}"
                </p>

                <div className="flex flex-col items-center gap-2">
                  <div className="text-[11px] font-[900] text-blue-600 uppercase tracking-[0.25em]">
                    {item.company}
                  </div>
                  <div className="text-sm text-slate-400 font-bold">
                    {item.author}, <span className="text-slate-600 font-medium">{item.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-5 mt-12">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1 rounded-full transition-all duration-700 ${
                idx === activeIndex ? 'w-14 bg-blue-600' : 'w-2.5 bg-slate-200'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
