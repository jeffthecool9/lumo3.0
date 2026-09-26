import React from 'react';
import { Zap, Target, TrendingUp, Clock, MessageSquare, CheckCircle } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Zap size={28} />,
      title: 'Instant Replies',
      description: 'Respond to customer inquiries in seconds, not hours. Never lose a sale to slow response times again.',
    },
    {
      icon: <Target size={28} />,
      title: 'Auto-Qualify Leads',
      description: 'Smart AI asks the right questions to filter tire-kickers and send you only serious buyers.',
    },
    {
      icon: <TrendingUp size={28} />,
      title: 'Close More Sales',
      description: 'Send product info, payment links, and confirmations directly in chat. Convert faster.',
    },
    {
      icon: <Clock size={28} />,
      title: '24/7 Availability',
      description: 'Work around the clock without hiring night shift staff. Capture leads while you sleep.',
    },
    {
      icon: <MessageSquare size={28} />,
      title: 'Natural Conversations',
      description: 'AI that sounds human, not robotic. Build trust and rapport with every interaction.',
    },
    {
      icon: <CheckCircle size={28} />,
      title: 'Easy Setup',
      description: 'No coding required. We build your custom chat flow and integrate it with your existing tools.',
    },
  ];

  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-[900] text-slate-900 mb-4">
          Everything you need to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            automate customer conversations
          </span>
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Built for businesses that want to scale without hiring more support staff
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="glass p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
