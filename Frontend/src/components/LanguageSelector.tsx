import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../types';

interface LanguageSelectorProps {
  dropUp?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ dropUp = false }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string; nameNative: string }[] = [
    { code: 'en', label: 'English', nameNative: 'English' },
    { code: 'hi', label: 'Hindi', nameNative: 'हिन्दी' },
    { code: 'gu', label: 'Gujarati', nameNative: 'ગુજરાતી' }
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#f4f8f0] hover:bg-[#e2ebd9] text-[#143601] transition-all border border-[#e2ebd9] shadow-2xs hover:scale-[1.02] cursor-pointer"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-[#538d22]" />
        <span>{currentLang.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#245501] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            dropUp ? 'bottom-full mb-2 right-0' : 'top-full mt-2 right-0'
          } w-52 rounded-2xl bg-white shadow-2xl border border-[#e2ebd9] py-2 z-50 animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#538d22] border-b border-[#f4f8f0] mb-1">
            Select Language
          </div>
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'font-extrabold text-[#143601] bg-[#f4f8f0]'
                    : 'font-bold text-[#4b633d] hover:bg-[#f4f8f0]/80 hover:text-[#143601]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Globe className={`w-3.5 h-3.5 ${isSelected ? 'text-[#538d22]' : 'text-[#73a942]'}`} />
                  <span>{lang.label} <span className="text-[10px] text-[#538d22] font-semibold">({lang.nameNative})</span></span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#538d22]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};


