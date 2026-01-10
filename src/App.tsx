import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') return;
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset - 100,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4">
      <div className="glass-heavy px-6 py-3 md:px-8 md:py-4 flex items-center justify-between w-full max-w-5xl rounded-[1.5rem]">
        <a href="/" className="flex items-center gap-3 group no-underline">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-5 h-5 relative z-10">
               <path d="M50 20 A 30 30 0 0 1 50 80 A 30 30 0 0 1 50 20" fill="none" stroke="#F0EEE9" strokeWidth="10" strokeLinecap="round" />
               <circle cx="50" cy="50" r="14" fill="#F0EEE9" />
            </svg>
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">Lumo</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="/#features" onClick={(e) => handleNavClick(e, '#features')} className="text-sm font-black text-slate-700 hover:text-blue-600 transition-colors">Features</a>
          <a href="/#pricing" onClick={(e) => handleNavClick(e, '#pricing')} className="text-sm font-black text-slate-700 hover:text-blue-600 transition-colors">Pricing</a>
          <a href="/#faq" onClick={(e) => handleNavClick(e, '#faq')} className="text-sm font-black text-slate-700 hover:text-blue-600 transition-colors">FAQ</a>
        </div>

        <div className="hidden md:block">
          <a 
            href="https://wa.me/0123456789" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-[#F0EEE9] text-sm font-bold hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
          >
            Chat on WhatsApp <ArrowRight size={16} />
          </a>
        </div>

        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-700">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`absolute top-full left-4 right-4 mt-2 p-4 rounded-2xl bg-[#F0EEE9]/90 backdrop-blur-xl border border-slate-300 shadow-2xl transition-all ${isMobileMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}>
        <div className="flex flex-col gap-4">
          <a href="/#features" className="text-lg font-black text-slate-900 p-2" onClick={(e) => handleNavClick(e, '#features')}>Features</a>
          <a href="/#pricing" className="text-lg font-black text-slate-900 p-2" onClick={(e) => handleNavClick(e, '#pricing')}>Pricing</a>
          <a href="/#faq" className="text-lg font-black text-slate-900 p-2" onClick={(e) => handleNavClick(e, '#faq')}>FAQ</a>
          <a href="https://wa.me/0123456789" className="w-full py-4 bg-blue-600 text-[#F0EEE9] rounded-xl font-bold text-center">Chat on WhatsApp</a>
        </div>
      </div>
    </nav>
  );
};
