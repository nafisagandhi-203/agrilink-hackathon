import React, { useState } from 'react';
import { TrendingUp, Search, Sparkles, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { BackButton } from '../../components/BackButton';

interface AdminMarketsPageProps {
  setActiveTab: (tab: string) => void;
}

export const AdminMarketsPage: React.FC<AdminMarketsPageProps> = ({ setActiveTab }) => {
  const { marketPrices, isLoading, refreshData } = useData();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRates = marketPrices.filter(
    (m) =>
      m.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.mandi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-plant-grow">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab="admin-dashboard" setActiveTab={setActiveTab} />
        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          State Mandi Price Intelligence Desk 🛡️
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#143601] flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#538d22]" />
            Live APMC Mandi Price Governance
          </h1>
          <p className="text-xs text-[#4b633d]">Monitor state mandi arrival rates, daily modal prices, and AI price stability indexes.</p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-[#538d22] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`${t('search')} mandi prices (e.g. Tomato, Rajkot)...`}
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#e2ebd9] bg-white text-xs font-semibold text-[#143601] focus:ring-2 focus:ring-[#538d22] focus:outline-none"
          />
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#e2ebd9] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-[#143601] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#538d22]" />
            Live State Mandi Rates Snapshot
          </h2>
          <button
            onClick={() => refreshData()}
            className="text-xs font-bold text-[#538d22] bg-[#f4f8f0] hover:bg-[#e2ebd9] px-3 py-1 rounded-full border border-[#e2ebd9] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Refreshing...' : 'Live Sync'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f4f8f0] text-[#245501] uppercase font-bold">
              <tr>
                <th className="p-3">Crop Name</th>
                <th className="p-3">APMC Mandi</th>
                <th className="p-3">State</th>
                <th className="p-3">Modal Price (₹/Qtl)</th>
                <th className="p-3">Range (Min - Max)</th>
                <th className="p-3">Trend Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f8f0] font-semibold">
              {filteredRates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#4b633d]">
                    {isLoading ? 'Loading live APMC mandi prices from database...' : 'No Mandi rates found in the database.'}
                  </td>
                </tr>
              ) : (
                filteredRates.map((m) => (
                  <tr key={m.id}>
                    <td className="p-3 font-extrabold text-[#143601]">{m.cropName}</td>
                    <td className="p-3">{m.mandi}</td>
                    <td className="p-3">{m.state}</td>
                    <td className="p-3 font-black text-emerald-800 text-sm">₹{m.modalPrice.toLocaleString()}</td>
                    <td className="p-3 text-[#4b633d]">₹{m.minPrice} - ₹{m.maxPrice}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.trend === 'up' ? 'bg-emerald-100 text-emerald-800' :
                        m.trend === 'down' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {m.trend === 'up' ? '↑ Rising' : m.trend === 'down' ? '↓ Falling' : '→ Stable'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
