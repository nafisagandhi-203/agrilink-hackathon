import React, { useState } from 'react';
import { ShoppingBag, PlusCircle, Sparkles, ArrowRight, CloudRain } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { weatherService, type BuyerEmergencyAlert } from '../../services/weatherService';
import { BackButton } from '../../components/BackButton';

interface BuyerDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { crops, buyerRequirements, buyerOffers, transactions } = useData();
  const { t } = useLanguage();

  const [emergencyAlert] = useState<BuyerEmergencyAlert | null>(
    weatherService.getBuyerEmergencyAlert()
  );
  const [dismissedEmergency, setDismissedEmergency] = useState(false);

  return (
    <div className="space-y-6 animate-plant-grow">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab="home" setActiveTab={setActiveTab} />
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Buyer Sourcing Workspace
        </span>
      </div>

      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#143601] via-[#1a4301] to-[#245501] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#538d22]/40">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#538d22]/30 text-[#aad576] text-xs font-extrabold border border-[#73a942]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#aad576]" />
            <span>Direct Farmer Sourcing Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome Back, Buyer 🛒
          </h1>
          <p className="text-xs sm:text-sm text-[#aad576] font-medium max-w-xl">
            {user?.businessDetails?.businessName || 'Shree Fresh Foods'} • Browse produce, post purchase requirements & send direct offers with zero middleman loss.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('buyer-requirements')}
          className="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#f4f8f0] text-[#143601] font-extrabold text-xs shadow-lg flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
        >
          <PlusCircle className="w-4 h-4 text-[#538d22]" />
          <span>Post Purchase Requirement</span>
        </button>
      </div>

      {/* 17. EMERGENCY BUYER ALERTS (When farmer weather alert is active) */}
      {emergencyAlert && !dismissedEmergency && (
        <div className="p-5 rounded-3xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-3 shadow-sm animate-plant-grow">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-rose-200 text-rose-900 shrink-0">
                <CloudRain className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-rose-950 flex items-center gap-1.5">
                  <span>{emergencyAlert.title}</span>
                  <span className="text-[10px] font-black px-2 py-0.2 rounded bg-rose-200 text-rose-900 uppercase">Emergency Supply</span>
                </h3>
                <p className="text-xs text-rose-900 font-medium">
                  {emergencyAlert.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => setDismissedEmergency(true)}
              className="text-xs font-bold text-rose-800 hover:text-rose-950 underline shrink-0"
            >
              {t('dismissAlert')}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-rose-900">
              Crops needing immediate buyers: <strong className="text-rose-950">Tomato, Wheat, Vegetables</strong>
            </span>

            <button
              onClick={() => setActiveTab('marketplace')}
              className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs shadow flex items-center gap-1 shrink-0"
            >
              <span>{t('viewAvailableCrops')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div
          onClick={() => setActiveTab('buyer-requirements')}
          className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] cursor-pointer space-y-1"
        >
          <span className="text-xs font-extrabold text-[#538d22] block">Active Requirements</span>
          <span className="text-2xl font-black text-[#143601]">{buyerRequirements.length}</span>
        </div>

        <div
          onClick={() => setActiveTab('marketplace')}
          className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] cursor-pointer space-y-1"
        >
          <span className="text-xs font-extrabold text-[#538d22] block">Available Crops</span>
          <span className="text-2xl font-black text-[#143601]">{crops.length}</span>
        </div>

        <div
          onClick={() => setActiveTab('buyer-offers')}
          className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] cursor-pointer space-y-1"
        >
          <span className="text-xs font-extrabold text-[#538d22] block">Pending Offers</span>
          <span className="text-2xl font-black text-[#143601]">{buyerOffers.length}</span>
        </div>

        <div
          onClick={() => setActiveTab('buyer-messages')}
          className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] cursor-pointer space-y-1"
        >
          <span className="text-xs font-extrabold text-[#538d22] block">Negotiations</span>
          <span className="text-2xl font-black text-[#143601]">1</span>
        </div>

        <div
          onClick={() => setActiveTab('buyer-transactions')}
          className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] cursor-pointer space-y-1"
        >
          <span className="text-xs font-extrabold text-[#538d22] block">Active Purchases</span>
          <span className="text-2xl font-black text-[#143601]">{transactions.length}</span>
        </div>

        <div
          onClick={() => setActiveTab('marketplace')}
          className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] cursor-pointer space-y-1"
        >
          <span className="text-xs font-extrabold text-[#538d22] block">Deliveries</span>
          <span className="text-2xl font-black text-[#143601]">1</span>
        </div>
      </div>

      {/* Available Produce Section */}
      <div className="p-6 rounded-3xl bg-white border border-[#e2ebd9] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#143601] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#538d22]" />
            Top Available Farm Produce
          </h3>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="text-xs font-extrabold text-[#245501] hover:underline"
          >
            Explore Full Marketplace →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {crops.slice(0, 3).map((crop) => (
            <div
              key={crop.id}
              className="p-4 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <img src={crop.image} alt={crop.cropName} className="w-full h-32 rounded-xl object-cover" />
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-[#143601]">{crop.cropName}</h4>
                  <span className="text-xs font-black text-[#538d22]">₹{crop.expectedPrice}/Qtl</span>
                </div>
                <p className="text-xs text-[#4b633d] font-medium">{crop.farmerName} • {crop.quantity} {crop.unit} ({crop.grade})</p>
              </div>

              <button
                onClick={() => setActiveTab('marketplace')}
                className="w-full py-2.5 rounded-xl bg-[#143601] text-white font-extrabold text-xs shadow hover:bg-[#1a4301]"
              >
                Make Offer
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
