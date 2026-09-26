import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export function FloatingWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl shadow-blue-500/50 flex items-center justify-center hover:scale-110 transition-transform animate-float-fast"
        aria-label="Chat with us"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 glass-heavy shadow-2xl animate-slide-up">
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Chat with Lumo
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Have questions? Our AI is here to help. Experience Lumo in action!
            </p>
            <a
              href="https://wa.me/0123456789?text=Hi%20Lumo%20I%27m%20interested"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full btn-gloss text-center"
            >
              Start Conversation
            </a>
          </div>
        </div>
      )}
    </>
  );
}
