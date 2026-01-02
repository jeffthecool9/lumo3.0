import React from 'react';

export const FloatingWidget: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden select-none opacity-[0.08]">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 1000 1000" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="pastelWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g className="wave-path">
          {[...Array(6)].map((_, i) => (
            <path
              key={i}
              stroke="url(#pastelWaveGradient)"
              strokeWidth={0.8}
              fill="none"
              d={`
                M -300, ${200 + (i * 120)} 
                C 200, ${100 + (i * 60)} 
                  700, ${1100 - (i * 90)} 
                  1300, ${200 + (i * 120)}
              `}
              style={{
                animation: `subtle-sway ${45 + i * 8}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </g>
      </svg>
      
      <style>{`
        @keyframes subtle-sway {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(80px, -40px) scale(1.05); }
        }
      `}</style>
    </div>
  );
};