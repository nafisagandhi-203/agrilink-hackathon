import React, { useState } from 'react';
import {
  Sprout,
  TrendingUp,
  Users,
  Receipt,
  PlusCircle,
  ChevronRight,
  CloudRain,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { weatherService, type WeatherAlert } from '../../services/weatherService';

interface FarmerDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ setActiveTab }) => {
  const { crops, buyerOffers, transactions } = useData();
  const { t } = useLanguage();

  const [weatherAlert] = useState<WeatherAlert | null>(
    weatherService.getFarmerWeatherAlert()
  );
  const [dismissedAlert, setDismissedAlert] = useState(false);

  const activeTx = transactions.filter((t) => t.deliveryStatus !== 'Completed');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header Banner */}
      <div className="gradient-banner-farmer p-6 sm:p-7 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#538d22]/30 text-[#aad576] text-xs font-extrabold border border-[#73a942]/40 backdrop-blur-xs">
            <span>👨‍🌾</span>
            <span>{t('farmerWorkspace')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t('goodMorningFarmer')}
          </h1>
          <p className="text-xs sm:text-sm text-[#aad576] font-medium max-w-xl">
            {t('farmerHeaderSub')}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('farmer-add-crop')}
          className="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#f4f8f0] text-[#143601] font-extrabold text-xs shadow-xl flex items-center gap-2 shrink-0 transition-transform hover:scale-105 cursor-pointer border border-[#e2ebd9]"
        >
          <PlusCircle className="w-4 h-4 text-[#538d22]" />
          <span>{t('addCrop')}</span>
        </button>
      </div>

      {/* WEATHER ALERT SYSTEM BANNER */}
      {weatherAlert && !dismissedAlert && (
        <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-3 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-amber-200 text-amber-900 shrink-0">
                <CloudRain className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
                  <span>{t('weatherAlertHeader')}</span>
                  <span className="text-[10px] font-black px-2 py-0.2 rounded bg-amber-200 text-amber-900 uppercase">
                    {t('highRisk')}
                  </span>
                </h3>
                <p className="text-xs text-amber-900 font-medium">
                  {weatherAlert.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => setDismissedAlert(true)}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 underline shrink-0 cursor-pointer"
            >
              {t('dismissAlert')}
            </button>
          </div>

          {/* WEATHER + SELL RECOMMENDATION */}
          <div className="p-3.5 rounded-2xl bg-white/90 border border-amber-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#143601]">
              <Sparkles className="w-4 h-4 text-[#538d22]" />
              <span>{t('aiRecommendationLabel')}</span>
            </div>
            <p className="text-xs text-slate-800 font-semibold leading-relaxed">
              "{weatherAlert.aiRecommendation}"
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setActiveTab('farmer-add-crop')}
              className="px-4 py-2 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow flex items-center gap-1 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>{t('sellCropNow')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#aad576]" />
            </button>

            <button
              onClick={() => setActiveTab('farmer-buyers')}
              className="px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-950 hover:bg-amber-100/50 font-extrabold text-xs transition-colors cursor-pointer"
            >
              {t('viewBuyers')}
            </button>
          </div>
        </div>
      )}

      {/* Quick Stat Cards - Professional Color System */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div
          onClick={() => setActiveTab('farmer-listings')}
          className="p-5 rounded-3xl dashboard-stat-card cursor-pointer space-y-3 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#538d22] uppercase tracking-wider">{t('myCrops')}</span>
            <div className="w-9 h-9 rounded-xl bg-[#f4f8f0] text-[#143601] group-hover:bg-[#143601] group-hover:text-[#aad576] flex items-center justify-center transition-colors shadow-2xs">
              <Sprout className="w-5 h-5 text-[#538d22] group-hover:text-[#aad576]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#143601]">{crops.length}</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Active Listings
            </span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('farmer-transactions')}
          className="p-5 rounded-3xl dashboard-stat-card cursor-pointer space-y-3 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-blue-700 uppercase tracking-wider">{t('buyerOffersCount')}</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-900 group-hover:bg-blue-900 group-hover:text-blue-200 flex items-center justify-center transition-colors shadow-2xs">
              <Users className="w-5 h-5 text-blue-700 group-hover:text-blue-200" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#143601]">{buyerOffers.length}</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              Received
            </span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('farmer-ai-price')}
          className="p-5 rounded-3xl dashboard-stat-card cursor-pointer space-y-3 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">{t('marketPrices')}</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#143601] group-hover:bg-[#143601] group-hover:text-[#aad576] flex items-center justify-center transition-colors shadow-2xs">
              <TrendingUp className="w-5 h-5 text-[#538d22] group-hover:text-[#aad576]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#143601]">₹2,450 / Qtl</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
              ↑ 8.4% Live
            </span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('farmer-transactions')}
          className="p-5 rounded-3xl dashboard-stat-card cursor-pointer space-y-3 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-800 uppercase tracking-wider">{t('activeDeals')}</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-900 group-hover:bg-amber-900 group-hover:text-amber-100 flex items-center justify-center transition-colors shadow-2xs">
              <Receipt className="w-5 h-5 text-amber-700 group-hover:text-amber-100" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#143601]">{activeTx.length}</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
              In Transit
            </span>
          </div>
        </div>

      </div>

      {/* Your Crop Listings Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#143601]">{t('myCrops')}</h2>
          <button
            onClick={() => setActiveTab('farmer-listings')}
            className="text-xs font-extrabold text-[#245501] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{t('viewDetails')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.slice(0, 3).map((crop) => (
            <div
              key={crop.id}
              className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-base text-[#143601]">{crop.cropName}</h3>
                  <p className="text-xs text-[#4b633d] font-medium">
                    {crop.quantity} {crop.unit} • {crop.grade} • {crop.location || 'Rajkot'}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#f4f8f0] text-[#143601] border border-[#e2ebd9]">
                  {t(crop.status.toLowerCase()) || crop.status}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-[#f4f8f0] pt-3">
                <div>
                  <span className="text-[10px] font-extrabold text-[#538d22] uppercase block">{t('expectedPrice')}</span>
                  <span className="text-base font-black text-[#143601]">
                    ₹{crop.expectedPrice.toLocaleString()} / Qtl
                  </span>
                </div>

                <button
                  onClick={() => setActiveTab('farmer-listings')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#f4f8f0] hover:bg-[#e2ebd9] text-[#143601] text-xs font-extrabold transition-colors cursor-pointer"
                >
                  {t('viewDetails')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

