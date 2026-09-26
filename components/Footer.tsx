import React from 'react';
import { MessageCircle, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-black">
                L
              </div>
              <span className="text-xl font-black">Lumo</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automate customer replies. Rescue time. Scale your business without scaling your team.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-slate-400 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="text-slate-400 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/terms" className="text-slate-400 hover:text-white transition-colors">
                  Terms & Policy
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/0123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Get in touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-slate-400">
                <MessageCircle size={18} className="flex-shrink-0 mt-0.5" />
                <a
                  href="https://wa.me/0123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: +60 12 345 6789
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <Mail size={18} className="flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:hello@lumo.ai"
                  className="hover:text-white transition-colors"
                >
                  hello@lumo.ai
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <span>Kuala Lumpur, Malaysia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>&copy; {currentYear} Lumo. All rights reserved.</p>
          <p>Built with care for Malaysian businesses</p>
        </div>
      </div>
    </footer>
  );
}
