import React from 'react';
import { Users, Sprout, TrendingUp, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { BackButton } from '../../components/BackButton';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab }) => {
  const { crops, transactions, usersList, alerts } = useData();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-plant-grow">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab="home" setActiveTab={setActiveTab} />
        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          {t('adminControlCenter')}
        </span>
      </div>

      {/* Top Banner */}
      <div className="gradient-banner-admin p-6 sm:p-7 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-extrabold border border-purple-400/40 backdrop-blur-xs">
            <span>🛡️</span>
            <span>{t('adminRoleTitle')} Control Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t('systemControlCenter')}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 font-medium max-w-xl">
            {t('adminBannerDesc')}
          </p>
        </div>
      </div>

      {/* Small Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div
          onClick={() => setActiveTab('admin-users')}
          className="p-5 rounded-3xl dashboard-stat-card cursor-pointer space-y-3 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-purple-800 uppercase tracking-wider">{t('users')}</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-900 group-hover:bg-purple-900 group-hover:text-purple-100 flex items-center justify-center transition-colors shadow-2xs">
              <Users className="w-5 h-5 text-purple-700 group-hover:text-purple-100" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{usersList.length}</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
              {t('verifiedUsers')}
            </span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('admin-markets')}
          className="p-5 rounded-3xl dashboard-stat-card cursor-pointer space-y-3 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">{t('crops')}</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#143601] group-hover:bg-[#143601] group-hover:text-[#aad576] flex items-center justify-center transition-colors shadow-2xs">
              <Sprout className="w-5 h-5 text-[#538d22] group-hover:text-[#aad576]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{crops.length}</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {t('liveMandi')}
            </span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('admin-transactions')}
          className="p-5 rounded-3xl dashboard-stat-card cursor-pointer space-y-3 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-blue-700 uppercase tracking-wider">{t('deals')}</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-900 group-hover:bg-blue-900 group-hover:text-blue-100 flex items-center justify-center transition-colors shadow-2xs">
              <TrendingUp className="w-5 h-5 text-blue-700 group-hover:text-blue-100" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{transactions.length}</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              {t('completedDeals')}
            </span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('admin-alerts')}
          className="p-5 rounded-3xl dashboard-stat-card cursor-pointer space-y-3 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-rose-800 uppercase tracking-wider">{t('priceAnomalies')}</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-900 group-hover:bg-rose-900 group-hover:text-rose-100 flex items-center justify-center transition-colors shadow-2xs">
              <AlertTriangle className="w-5 h-5 text-rose-700 group-hover:text-rose-100" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{alerts.length}</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
              {t('monitored')}
            </span>
          </div>
        </div>

      </div>

      {/* Clean Table: Active Platform Transactions */}
      <div className="p-5 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs space-y-3">
        <h2 className="text-sm font-black text-[#143601]">{t('recentTransactions')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f4f8f0] text-[#245501] uppercase font-bold">
              <tr>
                <th className="p-2.5">ID</th>
                <th className="p-2.5">{t('crops')}</th>
                <th className="p-2.5">{t('farmer')}</th>
                <th className="p-2.5">{t('buyer')}</th>
                <th className="p-2.5">{t('expectedPrice')}</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f8f0] font-medium">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-[#4b633d]">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
