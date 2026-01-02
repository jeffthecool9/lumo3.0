import React, { useState, useEffect, useRef } from 'react';
import { Send, Menu, Battery, Wifi, Signal, ChevronLeft } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToBot } from '../services/geminiService';

export const PhoneDemo: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi boss! 👋 Slow replies are killing your sales. Ask me how Lumo builds the perfect response flow for your business.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const handleScroll = () => {
      if (!phoneRef.current) return;
      const scrollY = window.scrollY;
      const rotation = Math.min(0, -2 + (scrollY * 0.01)); 
      const translateY = Math.min(10, scrollY * 0.03);
      phoneRef.current.style.transform = `perspective(1000px) rotateY(-4deg) rotateX(2deg) rotateZ(${rotation}deg) translateY(${translateY}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const replyText = await sendMessageToBot(userMsg.text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: replyText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const renderMessageContent = (msg: Message) => {
    const hasWhatsApp = msg.text.includes('[CTA:WHATSAPP]');
    const hasPricing = msg.text.includes('[CTA:PRICING]');
    const displayText = msg.text.replace(/\[CTA:.*?\]/g, '').trim();

    return (
      <div className="flex flex-col gap-2 items-start">
        <span className="whitespace-pre-wrap">{displayText}</span>
        {hasWhatsApp && (
          <a 
            href="https://wa.me/0123456789" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-full text-[11px] font-black transition-colors shadow-sm w-full justify-center uppercase tracking-widest hover:bg-blue-600"
          >
            Chat with Expert
          </a>
        )}
        {hasPricing && (
           <button 
             onClick={() => { document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }} 
             className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-full text-[11px] font-black transition-colors shadow-sm w-full justify-center uppercase tracking-widest hover:bg-blue-700"
           >
             View Packages
           </button>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={phoneRef}
      className="relative w-[300px] h-[620px] sm:w-[340px] sm:h-[680px] bg-white rounded-[3.5rem] border-[10px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden select-none transition-transform duration-100 ease-out z-50"
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-40 flex justify-center items-center">
        <div className="w-12 h-3 bg-black/40 rounded-full"></div>
      </div>

      <div className="w-full h-full bg-[#f8f9fb] flex flex-col relative pt-10">
        {/* Status Bar */}
        <div className="flex justify-between items-center px-8 pb-1 text-[10px] font-bold text-slate-500">
          <span>9:41</span>
          <div className="flex gap-1.5 items-center">
            <Signal size={10} />
            <Wifi size={10} />
            <div className="w-5 h-2.5 border border-slate-400 rounded-sm relative">
                <div className="absolute inset-[1px] bg-slate-500 rounded-[0.5px] w-3"></div>
            </div>
          </div>
        </div>

        {/* Header Section - Glossy Beauty Style */}
        <div className="px-5 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
               <ChevronLeft size={20} />
             </button>
             <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 relative shadow-inner">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
             </div>
             <div>
                <div className="text-[13px] font-black text-slate-900 tracking-tight">Lumo Assistant</div>
                <div className="text-[8px] text-blue-600 font-black uppercase tracking-[0.1em] flex items-center gap-1">
                   <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                   Response Active
                </div>
             </div>
          </div>
          <div className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
             <Menu size={18} />
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide bg-[#f8f9fb]">
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
              Today
            </span>
          </div>
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-reveal`}>
              <div className={`max-w-[85%] px-5 py-4 rounded-[1.5rem] text-[13px] leading-relaxed shadow-sm font-semibold ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
                }`}>
                {renderMessageContent(msg)}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
               <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-100 flex items-center gap-1.5 shadow-sm">
                 <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce"></div>
                 <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-5 bg-white border-t border-slate-100 pb-10">
           <div className="relative flex items-center">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="w-full bg-slate-50 text-slate-900 text-[13px] rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/10 border border-slate-200/60 placeholder-slate-400 transition-all font-semibold"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="absolute right-2 p-3 bg-blue-600 rounded-full text-white disabled:opacity-30 active:scale-90 transition-transform shadow-md"
              >
                <Send size={16} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
