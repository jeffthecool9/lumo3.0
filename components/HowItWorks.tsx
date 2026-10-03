import React from 'react';
import { MessageCircle, Settings, Rocket } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <MessageCircle size={32} />,
      title: 'Tell us about your business',
      description: 'Share your products, services, and common customer questions. Takes 10 minutes.',
    },
    {
      icon: <Settings size={32} />,
      title: 'We build your AI agent',
      description: 'Our team creates a custom chat flow trained on your specific business needs.',
    },
    {
      icon: <Rocket size={32} />,
      title: 'Go live & scale',
      description: 'Start converting more leads automatically. No hiring, no training, no headaches.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-[900] text-slate-900 mb-4">
          How it works
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          From setup to scale in 3 simple steps
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            <div className="glass-heavy p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-6 shadow-lg shadow-blue-500/30">
                {step.icon}
              </div>
              <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-lg shadow-lg">
                {idx + 1}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
            </div>
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-transparent"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
