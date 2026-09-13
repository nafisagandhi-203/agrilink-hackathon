import React, { useEffect, useState } from 'react';
import { Sprout, Sparkles, CheckCircle2, Cpu } from 'lucide-react';

interface SplashPageProps {
  onComplete: () => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  const getStatusText = (prog: number) => {
    if (prog < 25) return 'Connecting Farmers to Smarter Markets...';
    if (prog < 60) return 'Validating APMC Mandi Spot Prices...';
    if (prog < 85) return 'Optimizing Direct Cold-Chain Corridors...';
    if (prog < 100) return 'Securing Fair-Trade Escrow Channels...';
    return 'Ecosystem Connected • Ready';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#f4f8f0] via-white to-[#e8f2df] p-4 font-sans select-none">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100 text-center space-y-6 animate-plant-grow">
        
        {/* Top Tagline Badges */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-[#143601] text-[11px] font-bold tracking-wide">
            <span>🇮🇳</span>
            <span>Smart India Initiative • Agri-Stack 2.0</span>
          </div>
        </div>

        {/* Custom AgriPulse Logo */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-[#538d22]/20 animate-ping opacity-30" />
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#143601] via-[#245501] to-[#538d22] flex items-center justify-center shadow-xl shadow-emerald-900/20 text-white relative z-10 transform hover:scale-105 transition-transform">
            <Sprout className="w-10 h-10 text-white animate-leaf-float" />
          </div>
        </div>

        {/* Title & Taglines */}
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black tracking-tight text-[#143601]">
            AgriPulse
          </h1>
          <p className="text-xs font-bold text-[#245501]">
            Empowering Farmers. Enabling Fair Markets.
          </p>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#538d22] uppercase tracking-wider bg-[#f4f8f0] px-2.5 py-0.5 rounded-md border border-[#e2ebd9]">
            <Sparkles className="w-3 h-3 text-[#73a942]" />
            <span>AI Mandi Intelligence • Fair Trade Ecosystem</span>
          </div>
        </div>

        {/* Small AI/Agricultural Ecosystem Visual */}
        <div className="p-3.5 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] space-y-2">
          <div className="flex items-center justify-around text-xs font-bold text-[#143601]">
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-xl bg-emerald-200/80 flex items-center justify-center text-emerald-900">👨‍🌾</div>
              <span className="text-[10px]">Farmer</span>
            </div>
            
            {/* SVG Connecting Flow Lines */}
            <svg className="w-12 h-4" viewBox="0 0 48 16">
              <path d="M0,8 Q24,0 48,8" fill="none" stroke="#73a942" strokeWidth="2" className="animate-flow-line" />
            </svg>

            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800">
                <Cpu className="w-4 h-4 text-[#245501]" />
              </div>
              <span className="text-[10px]">AI Engine</span>
            </div>

            <svg className="w-12 h-4" viewBox="0 0 48 16">
              <path d="M0,8 Q24,16 48,8" fill="none" stroke="#73a942" strokeWidth="2" className="animate-flow-line" />
            </svg>

            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900">🛒</div>
              <span className="text-[10px]">Buyer</span>
            </div>
          </div>
        </div>

        {/* Connecting Progress & Message */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#143601]">
            <span className="truncate pr-2 text-left text-[11px] font-semibold text-[#245501]">
              {getStatusText(progress)}
            </span>
            <span className="font-mono text-[#538d22] font-black">{progress}%</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-[#e2ebd9] overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#245501] via-[#538d22] to-[#73a942] transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Bottom Connected Indicator */}
        {progress >= 100 && (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#143601] animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-[#538d22]" />
            <span>Ready! Entering Ecosystem...</span>
          </div>
        )}

      </div>
    </div>
  );
};
