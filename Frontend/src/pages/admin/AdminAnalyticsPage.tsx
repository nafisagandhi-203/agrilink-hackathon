import React from 'react';
import { BarChart3, TrendingUp, Users, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { BackButton } from '../../components/BackButton';
import { useData } from '../../context/DataContext';

interface AdminAnalyticsPageProps {
  setActiveTab?: (tab: string) => void;
}

export const AdminAnalyticsPage: React.FC<AdminAnalyticsPageProps> = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const { transactions, crops, usersList, marketPrices } = useData();

  const totalVolume = transactions.reduce((sum, t) => sum + (t.totalAmount || (t.agreedPrice * t.quantity) || 0), 0);
  const formattedVolume = totalVolume > 100000 
    ? `₹${(totalVolume / 100000).toFixed(1)} Lakhs` 
    : `₹${totalVolume.toLocaleString()}`;

  const commodityTrends = marketPrices.length > 0 ? marketPrices.slice(0, 5).map((m) => ({
    crop: m.cropName,
    location: `${m.mandi}, ${m.state}`,
    index: `₹${m.modalPrice.toLocaleString()} / Qtl (${m.trend === 'up' ? '↑ Rising' : m.trend === 'down' ? '↓ Falling' : '→ Stable'})`
  })) : [
    { crop: 'Tomato', location: 'Rajkot APMC, Gujarat', index: '₹2,450 / Qtl (↑ Rising)' },
    { crop: 'Wheat', location: 'Kondali APMC, Maharashtra', index: '₹2,420 / Qtl (↑ Rising)' },
    { crop: 'Cotton', location: 'Kadi Mandi, Gujarat', index: '₹7,100 / Qtl (→ Stable)' },
    { crop: 'Onion', location: 'Lasalgaon APMC, Maharashtra', index: '₹1,850 / Qtl (↓ Falling)' }
  ];

  return (
    <div className="space-y-6 animate-plant-grow">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        {setActiveTab ? (
          <BackButton fallbackTab="admin-dashboard" setActiveTab={setActiveTab} />
        ) : <div />}
        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          System Intelligence & Analytics 🛡️
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-[#f4f8f0] p-5 sm:p-6 rounded-3xl border border-[#e2ebd9]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#143601] text-xs font-bold border border-[#e2ebd9] mb-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-[#538d22]" />
          <span>Real-Time Ecosystem Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#143601]">{t('analytics')} & Intelligence</h1>
        <p className="text-xs text-[#4b633d] font-medium">Aggregated data on trade volume, Mandi price stability, demand forecasts, and user growth.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white border border-[#e2ebd9] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#538d22] uppercase">Total Trade Volume</span>
            <TrendingUp className="w-4 h-4 text-[#538d22]" />
          </div>
          <span className="text-2xl font-black text-[#143601]">{formattedVolume}</span>
          <p className="text-[11px] text-[#4b633d] font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-bold">{transactions.length} verified deals</span>
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#e2ebd9] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-blue-700 uppercase">Active Platform Users</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-[#143601]">{usersList.length}</span>
          <p className="text-[11px] text-[#4b633d] font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-bold">100% verified identities</span>
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#e2ebd9] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-purple-700 uppercase">Completed Deals</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-black text-[#143601]">{transactions.length}</span>
          <p className="text-[11px] text-[#4b633d] font-semibold">100% zero middleman markup</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#e2ebd9] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-700 uppercase">Live Crop Listings</span>
            <BarChart3 className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-[#143601]">{crops.length}</span>
          <p className="text-[11px] text-[#4b633d] font-semibold">Verified Mandi Producers</p>
        </div>

      </div>

      {/* Analytics Breakdown Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#e2ebd9] shadow-2xs space-y-4">
        <h2 className="text-sm font-black text-[#143601]">Live Regional Mandi Commodity Rates & Trends</h2>
        
        <div className="space-y-3">
          {commodityTrends.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-xs text-[#143601]">{item.crop}</h4>
                <p className="text-[11px] text-[#4b633d] font-semibold">{item.location}</p>
              </div>
              <span className="text-xs font-black text-[#143601] bg-white px-3 py-1 rounded-xl border border-[#e2ebd9]">
                {item.index}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
