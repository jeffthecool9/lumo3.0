import React from 'react';
import { Heart, Users, Zap, Target } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl font-[900] text-slate-900 mb-6">
          About Lumo
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          We're on a mission to help Malaysian businesses scale without the headache of hiring, training, and managing large support teams.
        </p>
      </div>

      <div className="glass-heavy p-8 mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Story</h2>
        <div className="space-y-4 text-slate-700 leading-relaxed">
          <p>
            Lumo was born from frustration. As business owners ourselves, we watched countless leads slip away because we couldn't reply fast enough. We hired more staff, but that brought new problems: training, scheduling, quality control, and mounting costs.
          </p>
          <p>
            We realized the solution wasn't more people—it was smarter automation. But existing chatbots were terrible: robotic, inflexible, and frustrating for customers.
          </p>
          <p>
            So we built Lumo: an AI that actually understands context, speaks naturally, and handles complex conversations without feeling like a bot. Today, we help hundreds of Malaysian businesses save money, close more sales, and sleep better knowing they never miss a lead.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="glass p-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <Target size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Our Mission</h3>
          <p className="text-slate-600">
            Make world-class AI automation accessible and affordable for every Malaysian business, from solopreneurs to enterprises.
          </p>
        </div>

        <div className="glass p-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <Heart size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Our Values</h3>
          <p className="text-slate-600">
            Customer obsession, radical transparency, and building tools that actually solve real problems for real people.
          </p>
        </div>

        <div className="glass p-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Our Team</h3>
          <p className="text-slate-600">
            A small but mighty crew of engineers, designers, and business operators based in Kuala Lumpur.
          </p>
        </div>

        <div className="glass p-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Our Promise</h3>
          <p className="text-slate-600">
            We're not happy unless you're making more money and saving time. That's the only metric that matters to us.
          </p>
        </div>
      </div>

      <div className="glass-heavy p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Want to learn more?
        </h2>
        <p className="text-slate-600 mb-6">
          Chat with us on WhatsApp. We're real humans, and we love talking shop.
        </p>
        <a
          href="https://wa.me/0123456789?text=Hi%20I%20want%20to%20know%20more%20about%20Lumo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block btn-gloss"
        >
          Chat with the team
        </a>
      </div>
    </div>
  );
}
