import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface UserProfileDropdownProps {
  setActiveTab: (tab: string) => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ setActiveTab }) => {
  const { user, role, logout } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = () => {
    switch (role) {
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

  const badge = getRoleBadge();

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-white hover:bg-[#f4f8f0] transition-all border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] cursor-pointer"
        aria-label="User Profile Menu"
      >
        <div className="w-8 h-8 rounded-full bg-[#143601] text-white flex items-center justify-center text-xs font-black shadow-2xs">
          {user?.name?.[0] || 'U'}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-black text-[#143601] leading-tight max-w-[130px] truncate">
            {user?.name || 'User'}
          </p>
          <span className={`inline-block text-[9px] font-extrabold px-1.5 py-0.1 rounded border uppercase ${badge.bg}`}>
            {role?.toUpperCase()}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#245501] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white shadow-2xl border border-[#e2ebd9] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header info */}
          <div className="px-4 py-2.5 border-b border-[#f4f8f0]">
            <p className="text-xs font-black text-[#143601] truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] text-[#4b633d] font-semibold truncate">{user?.phone || ''}</p>
            <span className={`inline-block mt-1 text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${badge.bg}`}>
              {badge.label}
            </span>
          </div>

          {/* Menu links */}
          <div className="py-1">
            <button
              onClick={() => {
                setActiveTab('profile');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-xs font-bold text-[#143601] hover:bg-[#f4f8f0] flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-[#538d22]" />
              <span>{t('profile')}</span>
            </button>

            <div className="border-t border-[#f4f8f0] my-1" />

            <button
              onClick={() => {
                logout();
                setIsOpen(false);
                setActiveTab('login');
              }}
              className="w-full px-4 py-2 text-left text-xs font-black text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
