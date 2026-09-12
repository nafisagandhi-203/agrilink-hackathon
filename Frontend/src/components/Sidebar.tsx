import React, { useState } from 'react';
import {
  Sprout,
  LayoutDashboard,
  TrendingUp,
  ShoppingBag,
  Users,
  Mic,
  CloudRain,
  Receipt,
  User,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Bell,
  BarChart3,
  Settings,
  AlertTriangle,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import type { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenVoiceModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenVoiceModal
}) => {
  const { user, role, logout } = useAuth();
  const { t } = useLanguage();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  if (!role) return null;

  // Role-specific nav configurations
  const getNavItems = () => {
    switch (role) {
      case 'farmer':
        return [
          { id: 'farmer-dashboard', label: t('dashboard'), icon: LayoutDashboard },
          { id: 'farmer-listings', label: t('myCrops'), icon: Sprout },
          { id: 'farmer-ai-price', label: t('marketPrices'), icon: TrendingUp },
          { id: 'farmer-buyers', label: t('buyers'), icon: Users },
          { id: 'voice-assistant', label: t('voiceAssistant'), icon: Mic, isVoice: true },
          { id: 'farmer-weather', label: t('weatherAlerts'), icon: CloudRain },
          { id: 'farmer-transactions', label: t('myDeals'), icon: Receipt },
          { id: 'profile', label: t('profile'), icon: User }
        ];

      case 'buyer':
        return [
          { id: 'buyer-dashboard', label: t('dashboard'), icon: LayoutDashboard },
          { id: 'marketplace', label: t('browseCrops'), icon: ShoppingBag },
          { id: 'market-prices', label: t('marketPrices'), icon: TrendingUp },
          { id: 'buyer-farmers', label: t('farmers'), icon: Users },
          { id: 'buyer-transactions', label: t('myDeals'), icon: Receipt },
          { id: 'buyer-notifications', label: t('notifications'), icon: Bell },
          { id: 'profile', label: t('profile'), icon: User }
        ];

      case 'admin':
        return [
          { id: 'admin-dashboard', label: t('dashboard'), icon: LayoutDashboard },
          { id: 'admin-users', label: t('users'), icon: Users },
          { id: 'admin-farmers', label: t('farmers'), icon: Sprout },
          { id: 'admin-buyers', label: t('buyers'), icon: ShoppingBag },
          { id: 'admin-markets', label: t('markets'), icon: TrendingUp },
          { id: 'admin-crops', label: t('crops'), icon: Package },
          { id: 'admin-alerts', label: t('alerts'), icon: AlertTriangle },
          { id: 'admin-transactions', label: t('deals'), icon: Receipt },
          { id: 'admin-analytics', label: t('analytics'), icon: BarChart3 },
          { id: 'profile', label: t('settings'), icon: Settings }
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleNavClick = (item: any) => {
    if (item.isVoice && onOpenVoiceModal) {
      onOpenVoiceModal();
    } else {
      setActiveTab(item.id);
    }
    setMobileDrawerOpen(false);
  };

  const getRoleBadgeStyle = (r: UserRole) => {
    switch (r) {
      case 'farmer':
        return { label: 'Farmer 👨‍🌾', bg: 'bg-[#538d22]/15 text-[#245501] border-[#73a942]/30' };
      case 'buyer':
        return { label: 'Buyer 🛒', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'admin':
        return { label: 'Admin 🛡️', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
      default:
        return { label: 'User', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    }
  };

  const badgeInfo = getRoleBadgeStyle(role);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 w-full bg-white text-[#143601] px-4 py-3 flex items-center justify-between shadow-xs border-b border-[#e2ebd9]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-1.5 rounded-xl bg-[#f4f8f0] text-[#143601] hover:bg-[#e2ebd9] border border-[#e2ebd9] transition-colors"
            aria-label="Open Sidebar Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#538d22] flex items-center justify-center text-white font-black text-xs">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="font-black text-base tracking-tight text-[#143601]">AgriPulse</span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${badgeInfo.bg}`}>
              {role.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          <button
            onClick={() => setActiveTab('home')}
            className="p-1.5 rounded-xl bg-[#f4f8f0] hover:bg-[#e2ebd9] text-xs font-extrabold text-[#143601] border border-[#e2ebd9] flex items-center gap-1"
            title="Return to Public Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#538d22]" />
            <span className="hidden sm:inline">Landing</span>
          </button>
        </div>
      </div>

      {/* Overlay Backdrop for Mobile Drawer */}
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
        />
      )}

      {/* Desktop Sidebar & Mobile Drawer Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-30 h-screen w-64 bg-white text-[#143601] flex flex-col justify-between shrink-0 shadow-lg transition-transform duration-300 ease-in-out border-r border-[#e2ebd9] ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header Section */}
        <div className="p-5 space-y-4 border-b border-[#e2ebd9]">
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#538d22] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-white animate-leaf-float" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-[#143601] block">
                  AgriPulse
                </span>
                <span className="text-[10px] font-black text-[#538d22] tracking-wide block">
                  AI Mandi Workspace
                </span>
              </div>
            </button>

            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-[#4b633d] hover:bg-[#f4f8f0]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current User & Role Badge Card (Clickable to View Profile) */}
          <button
            onClick={() => {
              setActiveTab('profile');
              setMobileDrawerOpen(false);
            }}
            className="w-full text-left p-3 rounded-2xl bg-[#f4f8f0] hover:bg-[#e2ebd9] border border-[#e2ebd9] flex items-center gap-3 transition-colors cursor-pointer group"
            title="View Profile & Settings"
          >
            <div className="w-9 h-9 rounded-full bg-[#538d22] flex items-center justify-center text-white font-black text-sm shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-[#143601] truncate group-hover:text-[#245501]">{user?.name || 'AgriPulse User'}</p>
              <span className={`inline-block text-[9px] font-black px-2 py-0.2 rounded border uppercase tracking-wider ${badgeInfo.bg}`}>
                {badgeInfo.label}
              </span>
            </div>
          </button>

        </div>

        {/* Middle Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-[#538d22]">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id ||
              (activeTab === 'market-prices' && item.id === 'farmer-ai-price') ||
              (activeTab === 'farmer-ai-price' && item.id === 'market-prices');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all duration-200 ease-out cursor-pointer active:scale-[0.98] ${
                  isActive
                    ? 'bg-[#f4f8f0] text-[#143601] font-extrabold border border-[#e2ebd9] shadow-xs translate-x-1'
                    : 'text-[#4b633d] font-bold hover:bg-[#f4f8f0]/80 hover:text-[#143601] hover:translate-x-1'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-[#245501]' : 'text-[#538d22]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && <div className="w-2 h-2 rounded-full bg-[#538d22] animate-pulse transition-all duration-200 shadow-2xs" />}
              </button>
            );
          })}
        </div>

        {/* Bottom Language & Logout Controls */}
        <div className="p-4 border-t border-[#e2ebd9] bg-[#f4f8f0]/40 space-y-3">
          
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black text-[#538d22] uppercase tracking-wider">Language</span>
            <LanguageSelector dropUp={true} />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                setActiveTab('role-selection');
                setMobileDrawerOpen(false);
              }}
              className="flex-1 py-2 px-2.5 rounded-xl bg-white hover:bg-[#f4f8f0] text-[#143601] border border-[#e2ebd9] text-[11px] font-extrabold transition-colors text-center truncate cursor-pointer shadow-2xs"
              title={t('switchRole')}
            >
              {t('switchRole')}
            </button>

            <button
              onClick={() => {
                logout();
                setActiveTab('role-selection');
                setMobileDrawerOpen(false);
              }}
              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition-colors cursor-pointer"
              title={t('logout')}
            >
              <LogOut className="w-4 h-4 text-rose-600" />
            </button>
          </div>

        </div>

      </aside>
    </>
  );
};

