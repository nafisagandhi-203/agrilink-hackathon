import React, { useState } from 'react';
import {
  Sprout,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Public Nav Items (No transporter role)
  const publicNavLinks = [
    { id: 'home', label: t('home') },
    { id: 'market-prices', label: t('marketPrices') },
    { id: 'marketplace', label: t('marketplace') },
    { id: 'how-it-works', label: t('howItWorks') }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e2ebd9] bg-white/95 backdrop-blur-md shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#143601] flex items-center justify-center text-white shadow-md shadow-[#143601]/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-[#aad576] animate-leaf-float" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-[#143601]">
                  AgriPulse
                </span>
                <p className="hidden md:block text-[11px] font-bold text-[#538d22] tracking-wide">
                  {t('tagline')}
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {publicNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === link.id
                    ? 'text-[#143601] bg-[#f4f8f0] border border-[#e2ebd9] shadow-2xs font-extrabold'
                    : 'text-[#245501] hover:text-[#143601] hover:bg-[#f4f8f0]/80'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Controls: Language, Login, Get Started / Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-[#f4f8f0] hover:bg-[#e2ebd9] transition-colors border border-[#e2ebd9]"
                >
                  <div className="w-7 h-7 rounded-full bg-[#143601] text-white flex items-center justify-center text-xs font-bold">
                    {user.name?.[0] || 'U'}
                  </div>
                  <span className="text-xs font-extrabold text-[#143601] hidden sm:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#245501] hidden sm:block" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-[#e2ebd9] py-2 z-50 animate-plant-grow">
                    <div className="px-4 py-2 border-b border-[#f4f8f0]">
                      <p className="text-[10px] font-bold text-[#538d22] uppercase">{t('roleSelectionDesc')}</p>
                      <p className="text-xs font-extrabold text-[#143601] truncate">{user.name}</p>
                      <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase">
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab(`${user.role}-dashboard`);
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-[#143601] hover:bg-[#f4f8f0] flex items-center justify-between"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#538d22]" />
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        setActiveTab('login');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#143601] hover:text-[#245501] hover:bg-[#f4f8f0] transition-colors"
                >
                  {t('login')}
                </button>

                <button
                  onClick={() => setActiveTab('role-selection')}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#143601] hover:bg-[#1a4301] text-white shadow-md shadow-[#143601]/20 transition-all hover:scale-105 flex items-center gap-1.5"
                >
                  <span>{t('getStarted')}</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#aad576]" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#143601] hover:bg-[#f4f8f0]"
              aria-label="Toggle Public Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e2ebd9] bg-white px-4 pt-3 pb-6 space-y-2 animate-plant-grow shadow-xl">
          {publicNavLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-bold ${
                activeTab === link.id
                  ? 'text-[#143601] bg-[#f4f8f0] font-extrabold'
                  : 'text-[#245501] hover:bg-[#f4f8f0]'
              }`}
            >
              {link.label}
            </button>
          ))}

          {!isAuthenticated && (
            <div className="pt-2 border-t border-[#f4f8f0] flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl text-center text-xs font-bold border border-[#e2ebd9] text-[#143601]"
              >
                {t('login')}
              </button>

              <button
                onClick={() => {
                  setActiveTab('role-selection');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl text-center text-xs font-bold bg-[#143601] text-white shadow"
              >
                {t('getStarted')}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
