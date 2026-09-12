import React from 'react';
import { Users, Sprout, TrendingUp, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { BackButton } from '../../components/BackButton';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab }) => {
  const { crops, transactions } = useData();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-plant-grow">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab="home" setActiveTab={setActiveTab} />
        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Admin Control Center 🛡️
        </span>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#143601]">
          Admin Control Center
        </h1>
        <p className="text-xs text-[#4b633d] font-medium">
          Platform monitoring, user verification, market integrity & price anomaly desk
        </p>
      </div>

      {/* Small Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div
          onClick={() => setActiveTab('admin-users')}
          className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-extrabold text-[#538d22]">{t('users')}</span>
            <div className="p-1.5 rounded-lg bg-[#f4f8f0] text-[#143601]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#143601] block">1,248</span>
        </div>

        <div
          onClick={() => setActiveTab('admin-markets')}
          className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-extrabold text-[#538d22]">{t('crops')}</span>
            <div className="p-1.5 rounded-lg bg-[#f4f8f0] text-[#143601]">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#143601] block">{crops.length}</span>
        </div>

        <div
          onClick={() => setActiveTab('admin-transactions')}
          className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-extrabold text-[#538d22]">{t('deals')}</span>
            <div className="p-1.5 rounded-lg bg-[#f4f8f0] text-[#143601]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#143601] block">{transactions.length}</span>
        </div>

        <div
          onClick={() => setActiveTab('admin-alerts')}
          className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-extrabold text-rose-700">{t('alerts')}</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#143601] block">2 Flagged</span>
        </div>

      </div>

      {/* Clean Table: Active Platform Transactions */}
      <div className="p-5 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs space-y-3">
        <h2 className="text-sm font-black text-[#143601]">Recent Platform Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f4f8f0] text-[#245501] uppercase font-bold">
              <tr>
                <th className="p-2.5">ID</th>
                <th className="p-2.5">Crop</th>
                <th className="p-2.5">Farmer</th>
                <th className="p-2.5">Buyer</th>
                <th className="p-2.5">Agreed Price</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f8f0] font-medium">
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="p-2.5 font-bold text-[#143601]">{tx.id}</td>
                  <td className="p-2.5">{tx.cropName} ({tx.quantity} {tx.unit})</td>
                  <td className="p-2.5">{tx.farmerName}</td>
                  <td className="p-2.5">{tx.buyerName}</td>
                  <td className="p-2.5 font-bold text-[#538d22]">₹{tx.agreedPrice}/Qtl</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f4f8f0] text-[#143601]">
                      {tx.deliveryStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
