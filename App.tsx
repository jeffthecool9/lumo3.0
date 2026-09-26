import React from 'react';
import { Navbar } from './components/Navbar';
import { PhoneDemo } from './components/PhoneDemo';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { FloatingWidget } from './components/FloatingWidget';
import { Testimonials } from './components/Testimonials';
import { Integrations } from './components/Integrations';
import { About } from './pages/About';
import { Terms } from './pages/Terms';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  const path = window.location.pathname;
  const isAboutPage = path === '/about';
  const isTermsPage = path === '/terms';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[120px]"></div>
         <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-cyan-50/50 rounded-full blur-[100px]"></div>
         <div className="absolute inset-0 bg-grid opacity-40"></div>
      </div>

      <Navbar />

      <main className="relative z-10">
        
        {isAboutPage ? (
          <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto"><About /></div>
        ) : isTermsPage ? (
          <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto"><Terms /></div>
        ) : (
          <>
            {/* 1. HERO SECTION - CENTERED */}
            <section className="pt-32 pb-12 lg:pt-48 lg:pb-24 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-[900] tracking-tight text-[#0f172a] mb-8 leading-[1.1]">
                Stop Losing Sales to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Slow Replies
                </span>
              </h1>
              
              <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                Every missed reply is a lost customer. We build your custom chat flow to respond instantly, qualify enquiries, and pass sales-ready buyers to you — even when you're offline.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full mb-16">
                <a 
                  href="https://wa.me/0123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 group px-8 py-4 text-base bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all font-bold min-w-[200px]"
                >
                  Chat with Lumo on WhatsApp 
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                </a>
                
                <div className="flex items-center gap-2 text-slate-500 bg-white/60 border border-slate-100 px-5 py-3.5 rounded-xl shadow-sm">
                  <ShieldCheck size={18} className="text-blue-500" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">
                    Built specifically for your business
                  </span>
                </div>
              </div>
              
              <div className="relative w-full flex justify-center z-10">
                 <PhoneDemo />
              </div>
            </section>

            {/* 2. CHANNELS (Integrations) */}
            <div id="channels">
              <Integrations />
            </div>

            {/* 3. TESTIMONIALS */}
            <Testimonials />

            {/* 4. REFRAMED FEATURES */}
            <Features />

            {/* 5. HOW IT WORKS */}
            <HowItWorks />

            {/* 6. PRICING SECTION */}
            <Pricing />

            {/* 7. FAQ */}
            <FAQ />
          </>
        )}
      </main>

      <Footer />
      <FloatingWidget />
    </div>
  );
}