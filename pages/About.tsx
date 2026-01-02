
import React from 'react';
import { Users, Heart, Shield, ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="animate-fade-in-scale">
      {/* Hero Section */}
      <section className="text-center mb-20 pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          Our Mission
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
          We Help Malaysian Businesses <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Sleep Better at Night
          </span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Lumo was built to solve a specific problem: You are losing sales because you can't be awake 24/7. We automate the busywork so you can focus on growth.
        </p>
      </section>

      {/* Story / Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Built for SMEs</h3>
          <p className="text-slate-500 leading-relaxed">
            We understand the local landscape. From "PM price" to late-night queries, our AI is trained on real Malaysian business chats.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
            <Heart size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Customer First</h3>
          <p className="text-slate-500 leading-relaxed">
            Automation shouldn't feel robotic. We prioritize natural, empathetic responses that make your customers feel heard.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Data Privacy</h3>
          <p className="text-slate-500 leading-relaxed">
            Your customer data is sacred. We use enterprise-grade encryption and never share your leads with third parties.
          </p>
        </div>
      </section>

      {/* Team / Context Section */}
      <section className="glass-heavy p-10 rounded-3xl mb-24 border border-white/50">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Why We Started Lumo</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Running a business in Malaysia is tough. You're the boss, the marketing manager, and the customer support agent all at once.
            </p>
            <p className="text-slate-600 mb-6 leading-relaxed">
              We saw too many business owners burning out, replying to WhatsApp messages at 2 AM just to secure a RM50 order. We knew there had to be a better way.
            </p>
            <p className="text-slate-600 font-medium">
              Lumo isn't just a chatbot; it's your best employee that never sleeps, never takes MC, and always replies instantly.
            </p>
          </div>
          <div className="flex-1 w-full relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl transform rotate-3 opacity-20 blur-lg"></div>
             <div className="relative bg-slate-900 rounded-2xl p-8 text-white shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-blue-500 rounded-full blur-[80px] opacity-20"></div>
                <div className="relative z-10">
                   <div className="text-4xl font-extrabold mb-2">3+ Years</div>
                   <div className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-8">In Development</div>
                   
                   <div className="text-4xl font-extrabold mb-2">10k+</div>
                   <div className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-8">Conversations Automated</div>
                   
                   <div className="text-4xl font-extrabold mb-2">24/7</div>
                   <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Uptime Guaranteed</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Ready to automate your business?</h2>
        <a 
          href="https://wa.me/0123456789" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
        >
          Book a Free Demo <ArrowRight size={20} />
        </a>
      </section>
    </div>
  );
};
