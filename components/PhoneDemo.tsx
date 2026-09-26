import React, { useState, useEffect } from 'react';
import { MessageCircle, Clock } from 'lucide-react';

export function PhoneDemo() {
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    { type: 'user', text: 'Hi, do you have slots available tomorrow?', delay: 0 },
    { type: 'bot', text: 'Yes! I have 3 slots: 10am, 2pm, and 4pm. Which works best?', delay: 1500 },
    { type: 'user', text: '2pm works!', delay: 3000 },
    { type: 'bot', text: 'Perfect! Booked for 2pm tomorrow. See you then!', delay: 4000 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-auto animate-float perspective-1000">
      <div className="glass-heavy p-6 rounded-[2.5rem] shadow-2xl shadow-blue-500/20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl"></div>

        <div className="mt-8 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">Lumo AI</div>
              <div className="text-xs text-green-500 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Online
              </div>
            </div>
          </div>
          <Clock size={18} className="text-slate-400" />
        </div>

        <div className="space-y-3 min-h-[300px] bg-slate-50/50 rounded-2xl p-4">
          {messages.slice(0, currentMessage + 1).map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.type === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'glass border border-slate-200 text-slate-800 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 p-3 bg-slate-50/50 rounded-full">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-sm text-slate-600"
            disabled
          />
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <MessageCircle size={16} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
