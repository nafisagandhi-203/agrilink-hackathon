import React from 'react';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BackButtonProps {
  onClick?: () => void;
  fallbackTab?: string;
  setActiveTab?: (tab: string) => void;
  className?: string;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  fallbackTab,
  setActiveTab,
  className = '',
  label
}) => {
  const { t } = useLanguage();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (setActiveTab && fallbackTab) {
      setActiveTab(fallbackTab);
    } else if (window.history.length > 1) {
      window.history.back();
    }
  };

  const isDashboardFallback = fallbackTab?.includes('dashboard');
  const displayLabel = label || (isDashboardFallback ? 'Back to Dashboard' : t('back'));

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#f4f8f0] text-[#143601] hover:text-[#1a4301] text-xs font-extrabold border border-[#e2ebd9] shadow-2xs transition-all duration-200 hover:-translate-x-0.5 active:translate-x-0 cursor-pointer group ${className}`}
      aria-label={displayLabel}
      title={displayLabel}
    >
      <ArrowLeft className="w-3.5 h-3.5 text-[#538d22] group-hover:-translate-x-0.5 transition-transform duration-200" />
      {isDashboardFallback && <LayoutDashboard className="w-3.5 h-3.5 text-[#538d22]" />}
      <span>{displayLabel}</span>
    </button>
  );
};

