import React from 'react';
import { Search, PenTool, Rocket } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-[#0f172a] mb-2 tracking-tight">Our Simple 3-Step Process</h2>
          <p className="text-slate-700 font-black uppercase tracking-widest text-[11px]">We build, You close.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center text-blue-600 mb-6 border border-slate-300 shadow-xl shadow-slate-200/50 group-hover:scale-105 transition-transform">
              <Search size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">1. Business Analysis</h3>
            <p className="text-slate-700 text-sm leading-relaxed font-semibold">
              We analyze your typical enquiries, common bottlenecks, and "PM price" queries that slow you down.
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-6 shadow-2xl shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <PenTool size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">2. Custom Build</h3>
            <p className="text-slate-700 text-sm leading-relaxed font-semibold">
              Our experts build a custom reply flow tailored specifically to your product variants, pricing, and tone.
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center text-blue-600 mb-6 border border-slate-300 shadow-xl shadow-slate-200/50 group-hover:scale-105 transition-transform">
              <Rocket size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">3. Launch & Recover</h3>
            <p className="text-slate-700 text-sm leading-relaxed font-semibold">
              Go live in 72 hours. Watch as missed enquiries turn into warm leads ready for your final confirmation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
