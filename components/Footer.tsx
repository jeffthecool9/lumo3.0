import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent border-t border-slate-300 pt-12 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-[#4D7CFF] to-[#1A46E5] flex items-center justify-center shadow-md overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#F0EEE9]/20 to-transparent pointer-events-none"></div>
                        <svg viewBox="0 0 100 100" className="w-5 h-5 relative z-10">
                            <path d="M50 20 A 30 30 0 0 1 50 80 A 30 30 0 0 1 50 20" fill="none" stroke="#F0EEE9" strokeWidth="12" strokeLinecap="round" className="opacity-90" />
                            <circle cx="50" cy="50" r="14" fill="#F0EEE9" />
                        </svg>
                    </div>
                    <span className="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-[#1A46E5]">
                        Lumo
                    </span>
                </div>
                <p className="text-blue-700 font-black text-xs tracking-wide uppercase ml-1 mt-1">Every Message. Answered.</p>
            </div>
            
            <p className="text-slate-800 text-sm leading-relaxed max-w-xs font-bold">
              Production-grade AI automation infrastructure for modern Malaysian SMEs.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-300 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-black text-slate-700">
          <div>© {new Date().getFullYear()} Lumo. All rights reserved.</div>
          <div>Made with 💙 in Malaysia</div>
        </div>
      </div>
    </footer>
  );
};