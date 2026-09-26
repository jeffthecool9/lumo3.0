import React from 'react';
import { Check, Star } from 'lucide-react';
import type { PricingTier } from '../types';

export function Pricing() {
  const tiers: PricingTier[] = [
    {
      name: 'Starter Pack',
      price: 'RM168',
      subPrice: '/month',
      description: 'First-time exclusive. Perfect for testing the waters.',
      features: [
        'Up to 1,000 conversations/month',
        'WhatsApp integration',
        'Basic lead qualification',
        '24/7 automated responses',
        'Email support',
        'Cancel anytime',
      ],
      ctaText: 'Start for RM168',
    },
    {
      name: 'Standard Starter',
      price: 'RM399',
      subPrice: '/month',
      description: 'Upgrade eligibility after 6 months on RM168 plan.',
      features: [
        'Up to 5,000 conversations/month',
        'Multi-channel (WhatsApp + FB Messenger)',
        'Advanced lead qualification',
        'Custom chat flows',
        'CRM integration',
        'Priority support',
        'Analytics dashboard',
      ],
      recommended: true,
      ctaText: 'Upgrade to RM399',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For established businesses with high volume needs.',
      features: [
        'Unlimited conversations',
        'All channels (WhatsApp, FB, IG, Web)',
        'Dedicated AI training',
        'Custom integrations',
        'White-label option',
        'Dedicated account manager',
        'SLA guarantee',
      ],
      ctaText: 'Contact Sales',
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-[900] text-slate-900 mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Choose the plan that fits your business. Cancel anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className={`glass-heavy p-8 relative ${
              tier.recommended ? 'ring-2 ring-blue-500 scale-105' : ''
            }`}
          >
            {tier.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                <Star size={14} fill="currentColor" />
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-black text-slate-900 mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-5xl font-black text-slate-900">{tier.price}</span>
                {tier.subPrice && (
                  <span className="text-slate-500 text-lg">{tier.subPrice}</span>
                )}
              </div>
              {tier.description && (
                <p className="text-sm text-slate-600">{tier.description}</p>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {tier.features.map((feature, featureIdx) => (
                <li key={featureIdx} className="flex items-start gap-3">
                  <Check size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href={
                tier.name === 'Enterprise'
                  ? 'https://wa.me/0123456789?text=Hi%20Lumo%20Enterprise'
                  : `https://wa.me/0123456789?text=Hi%20Lumo%20${tier.name}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full text-center py-3 rounded-xl font-bold transition-all ${
                tier.recommended
                  ? 'btn-gloss'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              {tier.ctaText}
            </a>

            <p className="text-xs text-center text-slate-500 mt-4">
              <a href="/terms" className="underline hover:text-blue-600">
                Terms & Policy
              </a>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
