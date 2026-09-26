import React from 'react';
import { MessageCircle, Facebook, Instagram, Globe, Mail, Calendar } from 'lucide-react';

export function Integrations() {
  const channels = [
    {
      icon: <MessageCircle size={32} />,
      name: 'WhatsApp',
      description: 'Connect directly with customers on their favorite messaging app',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: <Facebook size={32} />,
      name: 'Facebook Messenger',
      description: 'Automate responses to Facebook page messages',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Instagram size={32} />,
      name: 'Instagram DMs',
      description: 'Never miss an inquiry from Instagram followers',
      color: 'from-pink-500 to-purple-600',
    },
    {
      icon: <Globe size={32} />,
      name: 'Website Chat',
      description: 'Add AI chat widget to your website in minutes',
      color: 'from-slate-500 to-slate-600',
    },
    {
      icon: <Mail size={32} />,
      name: 'Email',
      description: 'Auto-respond to customer emails intelligently',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: <Calendar size={32} />,
      name: 'Booking Systems',
      description: 'Sync with Google Calendar, Calendly, and more',
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-[900] text-slate-900 mb-4">
            Connect all your channels
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            One AI agent, multiple platforms. Manage everything from a single dashboard.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel, idx) => (
            <div
              key={idx}
              className="glass-heavy p-6 hover:scale-105 transition-transform duration-300 group cursor-pointer"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${channel.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
              >
                {channel.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{channel.name}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{channel.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-6">
            Need a custom integration? We can connect Lumo to your existing tools.
          </p>
          <a
            href="https://wa.me/0123456789?text=Hi%20I%20need%20custom%20integration"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block btn-gloss"
          >
            Request Integration
          </a>
        </div>
      </div>
    </section>
  );
}
