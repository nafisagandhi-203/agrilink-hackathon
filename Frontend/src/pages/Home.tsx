import React from 'react';
import {
  ArrowRight,
  TrendingUp,
  Search,
  Mic,
  Sparkles,
  ShieldCheck,
  Users,
  Truck,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  onOpenVoiceModal?: () => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab, onOpenVoiceModal }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full space-y-12 pb-12 animate-plant-grow">
      
      {/* 4. LANDING HERO */}
      <section className="relative rounded-3xl bg-gradient-to-b from-[#f4f8f0] via-[#fcfdfa] to-white p-6 sm:p-10 lg:p-12 border border-[#e2ebd9] overflow-hidden shadow-xs">
        
        {/* Subtle Background AgriTech Leaf Animation */}
        <div className="absolute top-4 right-8 pointer-events-none opacity-20 text-[#538d22] animate-leaf-float">
          <span className="text-6xl">🌿</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Text & CTAs */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f4f8f0] border border-[#e2ebd9] text-[#143601] text-xs font-extrabold">
              <span>🇮🇳</span>
              <span>{t('smartIndiaInitiative')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#143601] tracking-tight leading-[1.15]">
              Sell Smarter.{' '}
              <span className="text-[#538d22]">Get Fairer Prices.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#4b633d] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Connect with trusted buyers, discover better prices and make smarter selling decisions with AI.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => setActiveTab('role-selection')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#143601] hover:bg-[#1a4301] text-white font-black text-sm shadow-xl shadow-[#143601]/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>{t('getStarted')}</span>
                <ArrowRight className="w-4 h-4 text-[#aad576]" />
              </button>

              <button
                onClick={() => setActiveTab('market-prices')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-[#f4f8f0] text-[#143601] font-bold text-sm border border-[#e2ebd9] shadow-2xs transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-[#538d22]" />
                <span>{t('exploreMarket')}</span>
              </button>
            </div>

            {/* Small Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold text-[#245501]">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#e2ebd9]">
                <TrendingUp className="w-4 h-4 text-[#538d22]" /> Live Market Prices
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#e2ebd9]">
                <Sparkles className="w-4 h-4 text-[#538d22]" /> AI Price Insights
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#e2ebd9]">
                <ShieldCheck className="w-4 h-4 text-[#538d22]" /> Direct Buyers
              </span>
            </div>
          </div>

          {/* Right Visual: Professional Indian Farming Graphic with ONLY TWO FLOATING CARDS */}
          <div className="relative flex items-center justify-center">
            
            <div className="relative w-full max-w-md bg-gradient-to-tr from-[#f4f8f0] to-white p-4 sm:p-6 rounded-3xl border border-[#e2ebd9] shadow-md space-y-4 text-center">
              
              <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden relative shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800"
                  alt="Indian Farming Field"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#143601]/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-left text-white space-y-0.5">
                  <span className="text-[10px] font-extrabold text-[#aad576] uppercase tracking-wider">Smart Farm Corridor</span>
                  <p className="text-xs font-extrabold truncate">Direct Farmer-to-Mandi AI Ecosystem</p>
                </div>
              </div>

              {/* ONLY TWO FLOATING CARDS */}
              {/* Card 1: Market Price */}
              <div className="absolute top-6 -left-2 sm:-left-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-[#e2ebd9] flex items-center gap-3 animate-leaf-float">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/90 text-[#143601] flex items-center justify-center font-bold text-lg">
                  🍅
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-extrabold text-[#538d22] uppercase tracking-wider block">Market Price</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black text-[#143601]">₹2,450 / Qtl</span>
                    <span className="text-[11px] font-extrabold text-[#538d22] bg-[#f4f8f0] px-1.5 py-0.2 rounded border border-[#e2ebd9]">
                      ↑ 8.2%
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: AI Insight */}
              <div className="absolute -bottom-3 -right-2 sm:-right-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-[#e2ebd9] flex items-center gap-3 animate-soft-pulse">
                <div className="w-10 h-10 rounded-xl bg-[#143601] text-[#aad576] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-extrabold text-[#538d22] uppercase tracking-wider block">AI Insight</span>
                  <span className="text-xs font-black text-[#143601]">Best time to sell: 6 days</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. MARKET SNAPSHOT */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-[#538d22] uppercase tracking-wider block">Live Mandi Intelligence</span>
            <h2 className="text-2xl font-black text-[#143601] tracking-tight">{t('todaysMarket')}</h2>
          </div>

          <button
            onClick={() => setActiveTab('market-prices')}
            className="text-xs font-extrabold text-[#245501] hover:text-[#143601] hover:underline flex items-center gap-1"
          >
            <span>{t('viewAllPrices')}</span>
          </button>
        </div>

        {/* Show ONLY 3 items */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => setActiveTab('market-prices')}
            className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🍅</span>
              <div>
                <span className="font-extrabold text-sm text-[#143601] block">Tomato</span>
                <span className="text-xs text-[#4b633d] font-medium">Rajkot APMC</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-[#143601] block">₹2,450 / Qtl</span>
              <span className="text-xs font-bold text-[#538d22]">↑ 8.4%</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('market-prices')}
            className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌾</span>
              <div>
                <span className="font-extrabold text-sm text-[#143601] block">Wheat</span>
                <span className="text-xs text-[#4b633d] font-medium">Gondal APMC</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-[#143601] block">₹2,420 / Qtl</span>
              <span className="text-xs font-bold text-[#538d22]">↑ 4.1%</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('market-prices')}
            className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">☁️</span>
              <div>
                <span className="font-extrabold text-sm text-[#143601] block">Cotton</span>
                <span className="text-xs text-[#4b633d] font-medium">Kadi Mandi</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-[#143601] block">₹7,100 / Qtl</span>
              <span className="text-xs font-bold text-[#538d22]">↑ 6.8%</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CORE FEATURES */}
      <section className="space-y-4">
        <div className="text-center max-w-md mx-auto space-y-1">
          <span className="text-[11px] font-black text-[#538d22] uppercase tracking-wider block">Empowering Agriculture</span>
          <h2 className="text-2xl font-black text-[#143601] tracking-tight">{t('coreFeaturesTitle')}</h2>
        </div>

        {/* ONLY Four Features - Fully Interactive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div
            onClick={() => setActiveTab('market-prices')}
            className="p-5 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs space-y-2.5 hover:border-[#538d22] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#f4f8f0] text-[#143601] flex items-center justify-center border border-[#e2ebd9] group-hover:bg-[#143601] group-hover:text-white transition-colors">
              <DollarSign className="w-5 h-5 text-[#538d22] group-hover:text-[#aad576]" />
            </div>
            <h3 className="text-sm font-extrabold text-[#143601] group-hover:text-[#245501]">{t('fairPricesTitle')}</h3>
            <p className="text-xs text-[#4b633d] font-medium leading-relaxed">
              {t('fairPricesDesc')}
            </p>
          </div>

          <div
            onClick={() => setActiveTab('role-selection')}
            className="p-5 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs space-y-2.5 hover:border-[#538d22] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#f4f8f0] text-[#143601] flex items-center justify-center border border-[#e2ebd9] group-hover:bg-[#143601] group-hover:text-white transition-colors">
              <Users className="w-5 h-5 text-[#538d22] group-hover:text-[#aad576]" />
            </div>
            <h3 className="text-sm font-extrabold text-[#143601] group-hover:text-[#245501]">{t('trustedBuyersTitle')}</h3>
            <p className="text-xs text-[#4b633d] font-medium leading-relaxed">
              {t('trustedBuyersDesc')}
            </p>
          </div>

          <div
            onClick={() => setActiveTab('market-prices')}
            className="p-5 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs space-y-2.5 hover:border-[#538d22] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#f4f8f0] text-[#143601] flex items-center justify-center border border-[#e2ebd9] group-hover:bg-[#143601] group-hover:text-white transition-colors">
              <Sparkles className="w-5 h-5 text-[#538d22] group-hover:text-[#aad576]" />
            </div>
            <h3 className="text-sm font-extrabold text-[#143601] group-hover:text-[#245501]">{t('aiInsightsTitle')}</h3>
            <p className="text-xs text-[#4b633d] font-medium leading-relaxed">
              {t('aiInsightsDesc')}
            </p>
          </div>

          <div
            onClick={() => setActiveTab('role-selection')}
            className="p-5 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs space-y-2.5 hover:border-[#538d22] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#f4f8f0] text-[#143601] flex items-center justify-center border border-[#e2ebd9] group-hover:bg-[#143601] group-hover:text-white transition-colors">
              <Truck className="w-5 h-5 text-[#538d22] group-hover:text-[#aad576]" />
            </div>
            <h3 className="text-sm font-extrabold text-[#143601] group-hover:text-[#245501]">{t('smartTransportTitle')}</h3>
            <p className="text-xs text-[#4b633d] font-medium leading-relaxed">
              {t('smartTransportDesc')}
            </p>
          </div>

        </div>
      </section>

      {/* 7. VOICE ASSISTANT SECTION */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#143601] via-[#1a4301] to-[#245501] text-white shadow-xl space-y-4 border border-[#538d22]/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#538d22]/30 text-[#aad576] text-xs font-extrabold border border-[#73a942]/40">
              <Mic className="w-3.5 h-3.5 text-[#aad576] animate-pulse" />
              <span>Multi-Lingual AI Voice Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('voiceSectionTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#aad576] font-medium max-w-xl">
              {t('voiceSectionText')}
            </p>
            <div className="text-xs font-bold text-white pt-1">
              Languages: <span className="text-[#aad576]">ગુજરાતી • हिन्दी • English</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (onOpenVoiceModal) onOpenVoiceModal();
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#538d22] hover:bg-[#73a942] text-white font-extrabold text-xs shadow-lg shadow-black/20 transition-all hover:scale-105 flex items-center justify-center gap-2 shrink-0 border border-[#73a942]"
          >
            <Mic className="w-4 h-4 text-white" />
            <span>{t('tryVoiceAssistant')}</span>
          </button>
        </div>
      </section>

    </div>
  );
};
