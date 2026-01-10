import React from 'react';
import { Check, ArrowRight, Zap } from 'lucide-react';

export const StarterPack: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-16 relative z-20">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">First-Time User Exclusive Offer</h3>
        <p className="text-slate-500 text-sm font-bold">Try Lumo at a discounted rate. Upgrade automatically after 6 months.</p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative bg-[#F0EEE9]/70 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>

          <div className="flex flex-col md:flex-row">
            {/* Left Side: Pricing & Info */}
            <div className="p-8 md:p-10 md:w-5/12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-900/5 bg-[#F0EEE9]/40">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Limited Offer
              </div>

              <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Starter Pack</h4>
              <p className="text-slate-500 text-xs mb-6 font-bold uppercase tracking-widest">For First-Time Users Only</p>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">RM168</span>
              </div>
              <p className="text-xs text-blue-600 font-black mb-6">Special Discount — First Month Only</p>

              <div className="text-[13px] text-slate-600 leading-relaxed mb-8 font-semibold">
                Perfect for trying Lumo with full features at a fraction of the price. Cancel anytime.
              </div>

              <a 
                href="https://wa.me/0123456789?text=I'm%20interested%20in%20the%20RM168%20Starter%20Pack"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-[#1477FF] hover:bg-blue-600 text-[#F0EEE9] font-black text-xs uppercase tracking-widest text-center shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                Get Started for RM168 <ArrowRight size={18} />
              </a>
              <p className="text-[10px] text-center text-slate-400 mt-3 font-bold">No risks. Cancel anytime.</p>
            </div>

            {/* Right Side: Features & Upgrade */}
            <div className="p-8 md:p-10 md:w-7/12 flex flex-col justify-center relative">
              <div className="mb-8 p-4 rounded-2xl bg-[#F0EEE9]/80 border border-white/40 flex items-start gap-4">
                <div className="p-2 bg-white/50 rounded-lg shadow-sm text-blue-600 shrink-0">
                  <Zap size={20} fill="currentColor" />
                </div>
                <div>
                  <h5 className="font-black text-slate-900 text-sm mb-1">FREE Upgrade to RM399 Plan after 6 Months</h5>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Users automatically qualify for a free upgrade to the Standard Plan permanently if active for 6 consecutive months.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {[
                  "Full AI Auto-Reply Engine",
                  "Unlimited Customer Messages",
                  "Lead Capture & Qualification",
                  "24/7 Support Automation",
                  "1 Product/Service Catalog",
                  "Access to Future Upgrades",
                  "Auto Follow-Up",
                  "Broadcast Campaigns"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-slate-600 font-bold">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
