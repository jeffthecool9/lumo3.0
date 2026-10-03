import React from 'react';
import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Lim',
      role: 'Founder, Beauty Salon',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&w=100',
      text: 'Lumo saved me RM15k/month in staff costs. It handles 80% of booking inquiries automatically. Game changer for my salon!',
      rating: 5,
    },
    {
      name: 'Ahmad Razak',
      role: 'Owner, Home Services',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&w=100',
      text: 'I used to miss leads while on jobs. Now Lumo qualifies them and books appointments even when I\'m busy. Revenue up 40%.',
      rating: 5,
    },
    {
      name: 'Jennifer Wong',
      role: 'Director, E-commerce',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&w=100',
      text: 'Customer support was killing us. Lumo handles FAQs, tracks orders, and only escalates real issues. Team size cut in half.',
      rating: 5,
    },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-blue-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-[900] text-slate-900 mb-4">
            Loved by Malaysian businesses
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Real results from real business owners
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="glass-heavy p-6 hover:scale-105 transition-transform duration-300"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={18} fill="#3b82f6" className="text-blue-500" />
                ))}
              </div>

              <Quote size={32} className="text-blue-500/30 mb-3" />

              <p className="text-slate-700 leading-relaxed mb-6">
                {testimonial.text}
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
