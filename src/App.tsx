import React from "react";

// IMPORTANT: adjust these imports to match your actual file names
import Navbar from "./components/Navbar";
import PhoneDemo from "./components/PhoneDemo";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import FloatingWidget from "./components/FloatingWidget";
import Testimonials from "./components/Testimonials";
import Integrations from "./components/Integrations";

export default function App() {
  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative">
      <FloatingWidget />

      <Navbar />

      <main className="relative z-10">
        {/* HERO */}
        <section className="pt-32 pb-12 lg:pt-48 lg:pb-24 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
          <div className="glass-glossy p-10 md:p-16 rounded-[3rem] max-w-5xl animate-float shadow-2xl mb-16 relative border border-white/60">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-[900] tracking-tighter text-[#0f172a] mb-8 leading-[1.05]">
              Stop Losing Sales to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Slow Replies
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed font-semibold mb-10 opacity-90">
              Every missed reply is a lost customer. We build your custom chat flow to respond instantly, qualify enquiries,
              and pass sales-ready buyers to you — even when you're offline.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
              <a
                href="https://wa.me/60123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 group px-10 py-4.5 text-base bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] transition-all font-bold min-w-[220px]"
              >
                Chat on WhatsApp →
              </a>

              <div className="flex items-center gap-2 text-slate-600 px-6 py-4 rounded-full border border-slate-200/60 bg-white/40 backdrop-blur-sm">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap">
                  Tailored for your business
                </span>
              </div>
            </div>
          </div>

          <div className="relative w-full flex justify-center z-10">
            <PhoneDemo />
          </div>
        </section>

        {/* SECTIONS */}
        <div id="channels">
          <Integrations />
        </div>

        <Testimonials />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
