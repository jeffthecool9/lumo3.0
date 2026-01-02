import React, { useState } from 'react';
import { Check, Server, Sparkles, RefreshCw } from 'lucide-react';

interface PricingTier {
  name: string;
  originalPrice: number;
  upfrontPrice: number;
  monthlyEquivOriginal: string;
  savings: number;
  description: string;
  features: string[];
  recommended?: boolean;
  maintenanceType: 'included' | 'recurring';
  maintenanceLabel: string;
  maintenanceSub: string;
  demoBadge: string;
}

const tiers: PricingTier[] = [
  {
    name: "Starter",
    originalPrice: 388,
    upfrontPrice: 368,
    monthlyEquivOriginal: "32",
    savings: 20,
    description: "Basic automation. One-time setup.",
    maintenanceType: 'included',
    maintenanceLabel: "One-time setup, System Maintanence Fee Applies",
    maintenanceSub: "For Everyone!",
    demoBadge: "Includes 7-Day Trial",
    features: [
      "WhatsApp automation (1 number)",
      "FAQ & basic auto-reply flows",
      "Business hours auto-reply",
      "Unlimited incoming chats",
      "Human handover button"
    ]
  },
  {
    name: "Growth",
    originalPrice: 688,
    upfrontPrice: 648,
    monthlyEquivOriginal: "57",
    savings: 40,
    description: "Best for growing businesses. Automation & CRM Management Fee applies.",
    recommended: true,
    maintenanceType: 'recurring',
    maintenanceLabel: "System Maintanence Fee Applies",
    maintenanceSub: "For Small-Medium Business",
    demoBadge: "Includes 7-Day Trial + Priority Setup",
    features: [
      "Everything in Starter",
      "Lead qualification & filtering",
      "Intent-based reply logic",
      "Auto follow-ups",
      "Google Sheets sync",
      "Priority support"
    ]
  },
  {
    name: "Pro Automation",
    originalPrice: 1288,
    upfrontPrice: 1188,
    monthlyEquivOriginal: "107",
    savings: 100,
    description: "Advanced workflows. Requires ongoing maintenance for stability & performance.",
    maintenanceType: 'recurring',
    maintenanceLabel: "System Maintanence Fee Applies",
    maintenanceSub: "Required for Stability",
    demoBadge: "Includes 14-Day Trial + VIP Onboarding",
    features: [
      "Custom workflow logic",
      "Industry-specific flows",
      "Omni-channel (WA + IG + FB)",
      "CRM & advanced integrations",
      "Reporting & analytics"
    ]
  }
];

export const Pricing: React.FC = () => {
  const [isUpfront, setIsUpfront] = useState(false);

  return (
    <section id="pricing" className="py-12 bg-transparent border-t border-slate-300 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header & Toggle */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Setup & Automation Plans</h2>
          
          <div className="flex justify-center items-center gap-4 mb-6">
            <button 
              onClick={() => setIsUpfront(false)}
              className={`text-xs font-black transition-all ${!isUpfront ? 'text-blue-600' : 'text-slate-700 hover:text-slate-900'}`}
            >
              Pay Monthly
            </button>
            
            <button 
              onClick={() => setIsUpfront(!isUpfront)}
              className="relative w-12 h-7 bg-slate-300 rounded-full p-1 transition-colors hover:bg-slate-400"
            >
              <div className={`w-5 h-5 bg-[#F0EEE9] rounded-full shadow-md transform transition-transform duration-300 ease-out ${isUpfront ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            
            <button 
              onClick={() => setIsUpfront(true)}
              className={`text-xs font-black transition-all ${isUpfront ? 'text-blue-600' : 'text-slate-700 hover:text-slate-900'}`}
            >
              Pay Upfront (Save More)
            </button>
          </div>
          
          <p className="text-slate-700 max-w-xl mx-auto text-sm font-bold opacity-100">
            Plans include one-time setup. Ongoing maintenance applies to selected plans.
          </p>
        </div>

        {/* FREE DEMO BANNER */}
        <div className="flex justify-center mb-10">
           <div className="glass-glossy px-6 py-3 rounded-full flex items-center gap-3 border border-white/60 shadow-sm backdrop-blur-md transition-transform hover:scale-[1.01]">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 border border-green-200">
                <Check size={10} className="text-green-700" strokeWidth={4} />
              </div>
              <span className="text-sm font-medium text-slate-600">
                <strong className="text-slate-900 font-extrabold">FREE Guided Demo (7 Days)</strong> — Try the flow first. No commitment.
              </span>
           </div>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {tiers.map((tier, idx) => (
            <div 
              key={idx}
              className={`relative rounded-[2rem] p-8 flex flex-col transition-all duration-500 bg-[#F0EEE9]/70 backdrop-blur-xl border ${
                tier.recommended 
                  ? 'border-blue-400 shadow-[0_15px_40px_-12px_rgba(37,99,235,0.15)] scale-100 md:scale-105 z-10' 
                  : 'border-slate-300 shadow-sm hover:shadow-xl hover:border-slate-400'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-[#F0EEE9] text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/30 flex items-center gap-1.5 uppercase tracking-[0.1em]">
                  <Sparkles size={10} fill="currentColor" />
                  Most Popular
                </div>
              )}

              {/* DEMO BADGE INSIDE CARD */}
              <div className="mb-4">
                 <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
                    <Check size={10} className="text-blue-600" strokeWidth={4} />
                    <span className="text-[9px] font-black text-blue-700 uppercase tracking-tight">
                       {tier.demoBadge}
                    </span>
                 </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-slate-900 mb-1 tracking-tight">{tier.name}</h3>
                <p className="text-slate-700 text-[11px] font-black mb-6 leading-relaxed min-h-[32px]">
                  {tier.description}
                </p>
                
                <div className="flex flex-col min-h-[100px] justify-center">
                  {!isUpfront ? (
                    <div className="flex items-baseline gap-1 text-slate-900">
                      <span className="text-4xl font-black tracking-tighter">
                        RM{tier.monthlyEquivOriginal}
                      </span>
                      <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.05em] translate-y-[-2px]">
                        / month
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500 font-black line-through">RM{tier.originalPrice}</span>
                        <div className="bg-blue-100 text-blue-700 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                          SAVE RM{tier.savings}
                        </div>
                      </div>
                      <div className="flex items-baseline gap-1 text-slate-900">
                        <span className="text-4xl font-black tracking-tighter">
                          RM{tier.upfrontPrice}
                        </span>
                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.05em] translate-y-[-2px]">
                          One-time Setup
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className={`mt-6 p-3 rounded-xl border flex items-center gap-3 ${tier.maintenanceType === 'recurring' ? 'bg-amber-100/30 border-amber-200' : 'bg-slate-200/50 border-slate-300'}`}>
                   <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-sm ${tier.maintenanceType === 'recurring' ? 'bg-white border-amber-200' : 'bg-white border-slate-300'}`}>
                      {tier.maintenanceType === 'recurring' ? (
                        <RefreshCw size={14} className="text-amber-600" />
                      ) : (
                        <Server size={14} className="text-slate-600" />
                      )}
                   </div>
                   <div className="flex flex-col">
                      <span className={`text-xs font-black leading-none mb-0.5 ${tier.maintenanceType === 'recurring' ? 'text-amber-900' : 'text-slate-900'}`}>
                        {tier.maintenanceLabel}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${tier.maintenanceType === 'recurring' ? 'text-amber-700' : 'text-slate-600'}`}>
                        {tier.maintenanceSub}
                      </span>
                   </div>
                </div>
              </div>

              <div className="h-px bg-slate-300 w-full mb-6"></div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-[13px] text-slate-800 leading-relaxed group/item">
                    <Check size={16} className="text-blue-600 shrink-0 mt-0.5" strokeWidth={3} />
                    <span className="font-bold">{feat}</span>
                  </li>
                ))}
              </ul>

              <a 
                href={`https://wa.me/0123456789?text=Hi%20Lumo,%20I'm%20interested%20in%20the%20${tier.name}%20Package.`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-4 rounded-xl font-black text-[11px] uppercase tracking-widest text-center transition-all duration-300 transform active:scale-[0.98] shadow-md ${
                tier.recommended
                  ? 'bg-blue-600 hover:bg-blue-700 text-[#F0EEE9] shadow-blue-500/25'
                  : 'bg-[#F0EEE9] border border-slate-400 text-slate-900 hover:bg-white'
              }`}>
                Try Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
