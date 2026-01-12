import React from 'react';
import { Instagram } from 'lucide-react';

export const Integrations: React.FC = () => {
  const platforms = [
    {
      name: 'WhatsApp',
      bgClass: 'bg-[#25D366]',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      bgClass: 'bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4]',
      icon: <Instagram size={24} className="text-white" strokeWidth={1.5} />
    },
    {
      name: 'Messenger',
      bgClass: 'bg-[#0084FF]',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.142 2 11.25c0 2.89 1.455 5.467 3.738 7.153V22l3.414-1.874c.91.253 1.886.39 2.89.39 5.52 0 10-4.142 10-9.25C22.042 6.142 17.562 2 12 2zm1.18 12.336L10.37 11.45l-5.36 2.848 5.88-6.248 2.83 2.91 5.34-2.87-5.88 6.246z"/>
        </svg>
      )
    },
    {
      name: 'TikTok',
      bgClass: 'bg-black border border-white/20',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      )
    }
  ];

  const tickerItems = [...platforms, ...platforms, ...platforms];

  return (
    <section className="py-6 pt-10 relative overflow-hidden bg-transparent border-y border-slate-100/50">
      <style>{`
        @keyframes scroll-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: scroll-ticker 30s linear infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10 mb-8">
        <h3 className="text-xl font-[900] text-slate-900 mb-2 tracking-tight">Connect Where Your Customers Are</h3>
        <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
          Multi-Channel Response Integration
        </p>
      </div>

      <div className="relative w-full overflow-hidden py-2">
        <div className="absolute left-0 top-0 bottom-0 w-40 z-20 bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/60 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-40 z-20 bg-gradient-to-l from-[#f8fafc] via-[#f8fafc]/60 to-transparent pointer-events-none"></div>

        <div className="flex w-max animate-ticker gap-8 px-8 items-center">
          {tickerItems.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white/70 backdrop-blur-sm px-6 py-4 rounded-2xl flex items-center gap-5 min-w-[240px] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transform group-hover:scale-110 transition-transform ${item.bgClass}`}>
                {item.icon}
              </div>
              
              <div className="flex flex-col">
                <span className="text-slate-900 font-extrabold text-[15px] tracking-tight">{item.name}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                  </span>
                  <span className="text-[9px] text-blue-600 font-black uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
