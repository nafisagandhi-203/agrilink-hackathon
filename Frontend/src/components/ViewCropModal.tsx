import React from 'react';
import { X, Sprout, MapPin, Calendar, CheckCircle2, TrendingUp, Send, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CropImage } from './CropImage';
import type { CropListing } from '../types';

export interface ViewCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  crop: CropListing | null;
  onMakeOffer?: (crop: CropListing) => void;
  onContactFarmer?: (crop: CropListing) => void;
}

export const ViewCropModal: React.FC<ViewCropModalProps> = ({
  isOpen,
  onClose,
  crop,
  onMakeOffer,
  onContactFarmer
}) => {
  const { t } = useLanguage();

  if (!isOpen || !crop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-[#F3F7E8] border-b border-[#DCE4D3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#5F8D4E] text-white flex items-center justify-center font-black shadow-xs">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#263322]">{crop.cropName} Produce Details</h3>
              <p className="text-[10px] font-bold text-[#5F8D4E] uppercase tracking-wider">
                FARM LISTING SPECIFICATIONS
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
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Top Banner Image & Price */}
          <div className="relative rounded-2xl overflow-hidden border border-[#DCE4D3] h-48 group">
            <CropImage src={crop.image} cropName={crop.cropName} alt={crop.cropName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-black text-white">{crop.cropName}</h4>
                  <p className="text-xs text-emerald-200 font-bold">{crop.variety} • Grade {crop.grade}</p>
                </div>
                <div className="text-right bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/30">
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-100">Asking Price</span>
                  <span className="text-lg font-black text-white">₹{crop.expectedPrice.toLocaleString()} / Qtl</span>
                </div>
              </div>
            </div>
          </div>

          {/* Producer / Farmer Card */}
          <div className="p-4 rounded-2xl bg-[#F8FAF5] border border-[#DCE4D3] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5F8D4E] text-white font-black text-sm flex items-center justify-center shadow-xs">
                {crop.farmerName?.[0] || 'F'}
              </div>
              <div>
                <h5 className="font-extrabold text-xs text-[#263322] flex items-center gap-1">
                  <span>{crop.farmerName}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5F8D4E]" />
                </h5>
                <p className="text-[11px] text-[#5F8D4E] font-bold">Verified Direct Farmgate Producer</p>
              </div>
            </div>

            {onContactFarmer && (
              <button
                onClick={() => {
                  onClose();
                  onContactFarmer(crop);
                }}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#E6F1D8] text-[#263322] border border-[#DCE4D3] text-xs font-black flex items-center gap-1 cursor-pointer transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#5F8D4E]" />
                <span>Contact</span>
              </button>
            )}
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
            
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Available Quantity</span>
              <span className="text-slate-900 font-extrabold text-sm">{crop.quantity} {crop.unit}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quality Grade</span>
              <span className="text-emerald-700 font-extrabold text-sm">{crop.grade}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Fair Price Range</span>
              <span className="text-slate-900 font-extrabold text-xs flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#5F8D4E]" />
                ₹{crop.aiFairPriceMin || crop.expectedPrice - 100} - ₹{crop.aiFairPriceMax || crop.expectedPrice + 150} / Qtl
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Harvest Date</span>
              <span className="text-slate-900 font-extrabold text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#5F8D4E]" />
                {crop.harvestDate || 'Fresh Harvest'}
              </span>
            </div>

          </div>

          {/* Location info */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs">
            <MapPin className="w-4 h-4 text-[#5F8D4E] shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Pickup Location & Mandi</span>
              <span className="text-slate-900 font-extrabold">{crop.pickupLocation || crop.location || 'Rajkot, Gujarat'}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
            >
              {t('cancel')}
            </button>
            {onMakeOffer && (
              <button
                onClick={() => {
                  onClose();
                  onMakeOffer(crop);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#5F8D4E] hover:bg-[#4d753e] text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('makeOffer')}</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
