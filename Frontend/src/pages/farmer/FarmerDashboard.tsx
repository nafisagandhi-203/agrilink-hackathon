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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f4f8f0] p-5 sm:p-6 rounded-3xl border border-[#e2ebd9] shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#143601] text-xs font-extrabold border border-[#e2ebd9] mb-2 shadow-2xs">
            <span>👨‍🌾</span>
            <span>{t('farmerWorkspace')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#143601]">
            {t('goodMorningFarmer')}
          </h1>
          <p className="text-xs text-[#4b633d] font-semibold">
            {t('farmerHeaderSub')}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('farmer-add-crop')}
          className="px-5 py-3 rounded-2xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow-md shadow-[#143601]/20 transition-all hover:scale-[1.02] flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#aad576]" />
          <span>{t('addCrop')}</span>
        </button>
      </div>

      {/* WEATHER ALERT SYSTEM BANNER */}
      {weatherAlert && !dismissedAlert && (
        <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-3 shadow-xs animate-in fade-in duration-200">
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

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div
          onClick={() => setActiveTab('farmer-listings')}
          className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer space-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#538d22]">{t('myCrops')}</span>
            <div className="p-1.5 rounded-lg bg-[#f4f8f0] text-[#143601] group-hover:bg-[#538d22] group-hover:text-white transition-colors">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#143601] block">{crops.length}</span>
        </div>

        <div
          onClick={() => setActiveTab('farmer-transactions')}
          className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer space-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#538d22]">{t('buyerOffersCount')}</span>
            <div className="p-1.5 rounded-lg bg-[#f4f8f0] text-[#143601] group-hover:bg-[#538d22] group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#143601] block">{buyerOffers.length}</span>
        </div>

        <div
          onClick={() => setActiveTab('farmer-ai-price')}
          className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer space-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#538d22]">{t('marketPrices')}</span>
            <div className="p-1.5 rounded-lg bg-[#f4f8f0] text-[#143601] group-hover:bg-[#538d22] group-hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#143601] block">₹2,450 / Qtl</span>
        </div>

        <div
          onClick={() => setActiveTab('farmer-transactions')}
          className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer space-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#538d22]">{t('activeDeals')}</span>
            <div className="p-1.5 rounded-lg bg-[#f4f8f0] text-[#143601] group-hover:bg-[#538d22] group-hover:text-white transition-colors">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#143601] block">{activeTx.length}</span>
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

