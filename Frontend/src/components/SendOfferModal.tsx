import React, { useState } from 'react';
import { X, Send, DollarSign, Package, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import type { CropListing } from '../types';

export interface SendOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  crop: CropListing | null;
  onSuccess?: () => void;
}

export const SendOfferModal: React.FC<SendOfferModalProps> = ({
  isOpen,
  onClose,
  crop,
  onSuccess
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { sendOffer } = useData();

  const [offeredPrice, setOfferedPrice] = useState<number>(crop?.expectedPrice || 2500);
  const [quantity, setQuantity] = useState<number>(crop?.quantity || 500);
  const [unit, setUnit] = useState<string>(crop?.unit || 'kg');
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Rajkot APMC Market');
  const [deliveryDate, setDeliveryDate] = useState<string>(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  React.useEffect(() => {
    if (crop) {
      setOfferedPrice(crop.expectedPrice);
      setQuantity(crop.quantity);
      setUnit(crop.unit || 'kg');
    }
  }, [crop]);

  if (!isOpen || !crop) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totalAmount = Math.round(offeredPrice * (quantity / 100)); // Price per quintal calculation

    sendOffer({
      cropListingId: crop.id,
      cropName: crop.cropName,
      buyerId: user?.id || 'usr-buyer-1',
      buyerName: user?.name || user?.businessDetails?.businessName || 'Shree Fresh Foods',
      buyerVerified: user?.verified !== false,
      offeredPrice: Number(offeredPrice),
      quantity: Number(quantity),
      unit,
      totalAmount,
      deliveryDate,
      compatibilityScore: 95,
      distanceKm: crop.distanceKm || 12,
      purchaseDate: new Date().toISOString().split('T')[0],
      gradeRequirement: crop.grade || 'Grade A',
      status: 'Pending'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-[#F3F7E8] border-b border-[#DCE4D3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#5F8D4E] text-white flex items-center justify-center font-black shadow-xs">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#263322]">{t('sendDirectOfferTitle')}</h3>
              <p className="text-[10px] font-bold text-[#5F8D4E] uppercase tracking-wider">
                FOR {crop.cropName} ({crop.farmerName})
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

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#DDECC8] text-[#263322] flex items-center justify-center mx-auto text-2xl font-black shadow-sm">
              ✓
            </div>
            <h4 className="text-lg font-black text-[#263322]">Offer Sent Successfully!</h4>
            <p className="text-xs text-[#5F8D4E] font-semibold">
              The farmer ({crop.farmerName}) has been notified of your offer card.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-semibold">
            
            {/* Crop Info Snapshot */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAF5] border border-[#DCE4D3] flex items-center justify-between">
              <div>
                <span className="font-extrabold text-sm text-[#263322] block">{crop.cropName}</span>
                <span className="text-[11px] text-[#5F8D4E] font-bold">Farmer: {crop.farmerName} • Grade: {crop.grade}</span>
              </div>
              <span className="text-xs font-black text-[#5F8D4E] bg-white px-2.5 py-1 rounded-xl border border-[#DCE4D3]">
                Asking: ₹{crop.expectedPrice}/Qtl
              </span>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-[11px] font-extrabold text-[#263322] mb-1">
                  {t('offeredPriceLabel')}
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-[#5F8D4E] absolute left-3 top-2.5" />
                  <input
                    type="number"
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(Number(e.target.value))}
                    required
                    min={100}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DCE4D3] bg-white text-xs font-bold text-[#263322] focus:ring-2 focus:ring-[#5F8D4E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#263322] mb-1">
                  {t('requiredQuantityLabel')}
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 text-[#5F8D4E] absolute left-3 top-2.5" />
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                    min={1}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DCE4D3] bg-white text-xs font-bold text-[#263322] focus:ring-2 focus:ring-[#5F8D4E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#263322] mb-1">
                  {t('deliveryLocationLabel')}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#5F8D4E] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DCE4D3] bg-white text-xs font-bold text-[#263322] focus:ring-2 focus:ring-[#5F8D4E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#263322] mb-1">
                  {t('preferredDeliveryDate')}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#5F8D4E] absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DCE4D3] bg-white text-xs font-bold text-[#263322] focus:ring-2 focus:ring-[#5F8D4E] focus:outline-none"
                  />
                </div>
              </div>

            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-[#263322] mb-1">
                {t('notesOptional')}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Ready for cash payment on delivery."
                className="w-full p-2.5 rounded-xl border border-[#DCE4D3] bg-white text-xs font-bold text-[#263322] focus:ring-2 focus:ring-[#5F8D4E] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DCE4D3]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#5F8D4E] hover:bg-[#4d753e] text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('submitOffer')}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
