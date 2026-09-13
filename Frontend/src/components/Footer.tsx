import React from 'react';
import { Sprout, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-[#f4f8f0] border-t border-[#e2ebd9] pt-8 pb-6 text-[#4b633d] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Compact Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-[#e2ebd9]">
          
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 font-extrabold text-[#143601] text-lg group text-left"
            >
              <div className="w-7 h-7 rounded-xl bg-[#143601] flex items-center justify-center text-white">
                <Sprout className="w-4 h-4 text-[#aad576]" />
              </div>
              <span>AgriPulse</span>
            </button>
            <p className="text-xs text-[#245501] font-medium">
              {t('tagline')}
            </p>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#538d22]">
              <Sparkles className="w-3 h-3" />
              <span>{t('smartIndiaInitiative')}</span>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-[#143601] uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-1.5 font-medium">
              <li>
                <button onClick={() => setActiveTab('market-prices')} className="hover:text-[#143601] transition-colors">
                  {t('marketPrices')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('marketplace')} className="hover:text-[#143601] transition-colors">
                  {t('marketplace')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('how-it-works')} className="hover:text-[#143601] transition-colors">
                  {t('howItWorks')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Roles */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-[#143601] uppercase tracking-wider text-[11px]">Stakeholders</h4>
            <ul className="space-y-1.5 font-medium">
              <li>
                <button onClick={() => setActiveTab('role-selection')} className="hover:text-[#143601] transition-colors">
                  👨‍🌾 {t('farmerRoleTitle')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('role-selection')} className="hover:text-[#143601] transition-colors">
                  🛒 {t('buyerRoleTitle')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('role-selection')} className="hover:text-[#143601] transition-colors">
                  🛡️ {t('adminRoleTitle')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-[#143601] uppercase tracking-wider text-[11px]">Support</h4>
            <ul className="space-y-1.5 font-medium">
              <li>
                <button onClick={() => setActiveTab('how-it-works')} className="hover:text-[#143601] transition-colors">
                  Help & How It Works
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('profile')} className="hover:text-[#143601] transition-colors">
                  Privacy & Fair Trade Terms
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Divider & Copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#538d22] font-medium">
          <p>© 2026 AgriPulse • Smart India Hackathon Project</p>
          <div className="flex items-center gap-4 text-[#245501] font-semibold">
            <span>🇮🇳 Empowering Indian Agriculture with AI</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
