import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BackButton } from '../components/BackButton';
import type { UserRole } from '../types';

interface RoleSelectionProps {
  setActiveTab: (tab: string) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ setActiveTab }) => {
  const { demoLogin } = useAuth();
  const { t } = useLanguage();

  const handleRoleSelect = (role: UserRole) => {
    demoLogin(role);
    if (role === 'farmer') setActiveTab('farmer-dashboard');
    else if (role === 'buyer') setActiveTab('buyer-dashboard');
    else if (role === 'admin') setActiveTab('admin-dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-plant-grow">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab="home" setActiveTab={setActiveTab} />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f8f0] text-[#143601] text-xs font-bold border border-[#e2ebd9]">
          <Sparkles className="w-3.5 h-3.5 text-[#538d22]" />
          <span>{t('selectRole')}</span>
        </div>
      </div>

      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-[#143601] tracking-tight">
          {t('chooseRoleTitle')}
        </h1>
        <p className="text-sm font-medium text-[#4b633d]">
          {t('roleSelectionDesc')}
        </p>
      </div>

      {/* 3 Role Selection Cards ONLY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        
        {/* Farmer Card */}
        <div
          onClick={() => handleRoleSelect('farmer')}
          className="group relative p-6 sm:p-7 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm hover:shadow-xl hover:border-[#538d22] transition-all cursor-pointer flex flex-col justify-between space-y-6 hover:-translate-y-1"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100/90 text-[#143601] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-xs">
              👨‍🌾
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-extrabold text-[#143601] group-hover:text-[#245501]">
                  {t('farmerRoleTitle')}
                </h3>
                <span className="text-xs font-bold text-[#538d22] bg-[#f4f8f0] px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
              <p className="text-xs text-[#4b633d] font-medium leading-relaxed">
                {t('farmerRoleDesc')}
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#f4f8f0]">
            <span className="text-xs font-extrabold text-[#245501] group-hover:underline">
              Enter Workspace
            </span>
            <div className="w-8 h-8 rounded-full bg-[#f4f8f0] group-hover:bg-[#143601] group-hover:text-white flex items-center justify-center text-[#143601] transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Buyer Card */}
        <div
          onClick={() => handleRoleSelect('buyer')}
          className="group relative p-6 sm:p-7 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm hover:shadow-xl hover:border-[#538d22] transition-all cursor-pointer flex flex-col justify-between space-y-6 hover:-translate-y-1"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100/90 text-blue-900 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-xs">
              🛒
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-extrabold text-[#143601] group-hover:text-[#245501]">
                  {t('buyerRoleTitle')}
                </h3>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  Verified
                </span>
              </div>
              <p className="text-xs text-[#4b633d] font-medium leading-relaxed">
                {t('buyerRoleDesc')}
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#f4f8f0]">
            <span className="text-xs font-extrabold text-[#245501] group-hover:underline">
              Enter Workspace
            </span>
            <div className="w-8 h-8 rounded-full bg-[#f4f8f0] group-hover:bg-[#143601] group-hover:text-white flex items-center justify-center text-[#143601] transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Admin Card */}
        <div
          onClick={() => handleRoleSelect('admin')}
          className="group relative p-6 sm:p-7 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm hover:shadow-xl hover:border-[#538d22] transition-all cursor-pointer flex flex-col justify-between space-y-6 hover:-translate-y-1"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-100/90 text-purple-900 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-xs">
              🛡️
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-extrabold text-[#143601] group-hover:text-[#245501]">
                  {t('adminRoleTitle')}
                </h3>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  Control
                </span>
              </div>
              <p className="text-xs text-[#4b633d] font-medium leading-relaxed">
                {t('adminRoleDesc')}
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#f4f8f0]">
            <span className="text-xs font-extrabold text-[#245501] group-hover:underline">
              Enter Control Center
            </span>
            <div className="w-8 h-8 rounded-full bg-[#f4f8f0] group-hover:bg-[#143601] group-hover:text-white flex items-center justify-center text-[#143601] transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
