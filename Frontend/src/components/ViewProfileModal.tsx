import React from 'react';
import { X, Phone, Mail, MapPin, CheckCircle2, Building2, Sprout, MessageCircle, Sparkles, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { UserRole } from '../types';

export interface ViewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: {
    name: string;
    role?: UserRole | string;
    phone?: string;
    email?: string;
    location?: string;
    verified?: boolean;
    joinedDate?: string;
    compatibilityScore?: number;
    cropRequirement?: string;
    offeredPrice?: number;
    distanceKm?: number;
    farmDetails?: {
      farmSizeAcres?: number;
      primaryCrops?: string[];
      pickupAddress?: string;
    };
    businessDetails?: {
      businessName?: string;
      gstNumber?: string;
      businessType?: string;
    };
  } | null;
}

export const ViewProfileModal: React.FC<ViewProfileModalProps> = ({
  isOpen,
  onClose,
  profileData
}) => {
  const { t } = useLanguage();

  if (!isOpen || !profileData) return null;

  const roleName = profileData.role || 'farmer';
  const phone = profileData.phone || '+91 98765 43210';
  const email = profileData.email || `${profileData.name.toLowerCase().replace(/\s+/g, '')}@agripulse.in`;
  const location = profileData.location || 'Rajkot, Gujarat';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-[#F3F7E8] border-b border-[#DCE4D3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#5F8D4E] text-white flex items-center justify-center font-black shadow-xs">
              {roleName === 'buyer' ? <Building2 className="w-5 h-5" /> : <Sprout className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#263322]">{t('contactDetails')}</h3>
              <p className="text-[10px] font-bold text-[#5F8D4E] uppercase tracking-wider">
                {roleName.toUpperCase()} IDENTITY
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer border border-[#DCE4D3]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Main User Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAF5] border border-[#DCE4D3]">
            <div className="w-14 h-14 rounded-full bg-[#5F8D4E] text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
              {profileData.name?.[0] || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-black text-base text-[#263322] truncate flex items-center gap-1.5">
                <span>{profileData.name}</span>
                {profileData.verified !== false && (
                  <CheckCircle2 className="w-4 h-4 text-[#5F8D4E] shrink-0" />
                )}
              </h4>
              <p className="text-xs text-[#5F8D4E] font-bold truncate">
                {profileData.businessDetails?.businessName || profileData.farmDetails?.pickupAddress || `${location} Producer`}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded bg-[#DDECC8] text-[#263322] border border-[#5F8D4E]/20">
                  {profileData.verified !== false ? t('verifiedBadge') : t('pendingVerification')}
                </span>
                {profileData.compatibilityScore && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                    <Sparkles className="w-3 h-3 text-emerald-700" />
                    {profileData.compatibilityScore}% Match
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sourcing / Buyer Specific Card Info */}
          {(profileData.cropRequirement || profileData.offeredPrice) && (
            <div className="p-3.5 rounded-2xl bg-[#F3F7E8] border border-[#DCE4D3] space-y-1.5 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span className="text-[#5F8D4E] font-bold text-[11px] flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Sourcing Requirement</span>
                </span>
                {profileData.distanceKm && (
                  <span className="text-[10px] font-bold text-slate-500">
                    📍 {profileData.distanceKm} km away
                  </span>
                )}
              </div>
              {profileData.cropRequirement && (
                <p className="font-extrabold text-[#263322] text-sm">{profileData.cropRequirement}</p>
              )}
              {profileData.offeredPrice && (
                <p className="text-xs text-[#5F8D4E] font-black">
                  Offered Price: <span className="text-base font-black text-[#263322]">₹{profileData.offeredPrice.toLocaleString()} / Qtl</span>
                </p>
              )}
            </div>
          )}

          {/* Details List */}
          <div className="space-y-3 text-xs font-semibold">
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Phone className="w-4 h-4 text-[#5F8D4E] shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Phone Number</span>
                <span className="text-slate-800 font-extrabold">{phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Mail className="w-4 h-4 text-[#5F8D4E] shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Email Address</span>
                <span className="text-slate-800 font-extrabold truncate block">{email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <MapPin className="w-4 h-4 text-[#5F8D4E] shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Location / APMC</span>
                <span className="text-slate-800 font-extrabold">{location}</span>
              </div>
            </div>

            {profileData.businessDetails?.gstNumber && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Building2 className="w-4 h-4 text-[#5F8D4E] shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">GST License</span>
                  <span className="text-slate-800 font-extrabold">{profileData.businessDetails.gstNumber}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="py-3 px-4 rounded-xl bg-[#5F8D4E] hover:bg-[#4d753e] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 text-center cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>{t('callNow')}</span>
            </a>

            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 text-center cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('whatsappMessage')}</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
