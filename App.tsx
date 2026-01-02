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
    <div className="min-h-screen text-slate-900 font-sans overflow-x-hidden relative bg-white">
      <FloatingWidget />
      <Navbar />

      <main className="relative z-10">

        {/* =========================
            STATIC PAGES
        ========================== */}
        {isAboutPage && (
          <div className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
            <About />
          </div>
        )}

        {isTermsPage && (
          <div className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
            <Terms />
          </div>
        )}

        {/* =========================
            MAIN LANDING PAGE
        ========================== */}
        {!isAboutPage && !isTermsPage && (
          <>
            {/* =========================
                HERO SECTION
            ========================== */}
            <section className="pt-28 pb-0 lg:pt-40 lg:pb-0 px-6 max-w-6xl mx-auto text-center">
              {/* Box made more obvious with glass-glossy opacity update and white/80 border */}
              <div className="glass-glossy p-10 md:p-16 rounded-[3rem] max-w-5xl mx-auto shadow-2xl border border-white/80 relative overflow-hidden">
                
                {/* Subtle top-left sheen to define form */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>

                <div className="relative z-10">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
                    Stop Losing Sales to <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                      Slow Replies
                    </span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 font-medium">
                    We build automation that replies instantly, qualifies leads,
                    and sends only serious buyers to WhatsApp — even when you sleep.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a
                      href="https://wa.me/0123456789"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition transform hover:-translate-y-1"
                    >
                      Chat on WhatsApp
                      <ArrowRight size={20} />
                    </a>

                    <div className="flex items-center gap-2 px-6 py-4 rounded-full border border-slate-200 bg-white shadow-sm">
                      <ShieldCheck size={18} className="text-blue-500" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Built for real businesses
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-center translate-y-2">
                <PhoneDemo />
              </div>
            </section>

            {/* =========================
                CONTENT SECTIONS
                (Zero Gap Layout)
            ========================== */}
            <div className="space-y-0">

              <section>
                <Integrations />
              </section>

              <section>
                <Testimonials />
              </section>

              <section>
                <Features />
              </section>

              <section>
                <HowItWorks />
              </section>

              <section>
                <Pricing />
              </section>

              <section>
                <FAQ />
              </section>

            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}