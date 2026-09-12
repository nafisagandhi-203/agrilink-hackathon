import React from 'react';
import { Building2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface RecommendedBuyersProps {
  setActiveTab: (tab: string) => void;
}

export const RecommendedBuyers: React.FC<RecommendedBuyersProps> = ({ setActiveTab }) => {
  const { buyerOffers } = useData();

  return (
    <div className="space-y-6 animate-plant-grow">
      
      <div className="bg-[#f4f8f0] p-5 sm:p-6 rounded-3xl border border-[#e2ebd9]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#143601] text-xs font-bold border border-[#e2ebd9] mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#538d22]" />
          <span>AI Sourcing Compatibility</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#143601]">Recommended Buyers</h1>
        <p className="text-xs text-[#4b633d] font-medium">AI-matched verified buyers interested in your listed crops.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {buyerOffers.map((offer) => (
          <div
            key={offer.id}
            className="p-5 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm hover:border-[#538d22] hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-base text-[#143601] flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#538d22]" />
                    <span>{offer.buyerName}</span>
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#538d22] bg-[#f4f8f0] px-2 py-0.5 rounded border border-[#e2ebd9] mt-1">
                    <CheckCircle2 className="w-3 h-3 text-[#538d22]" /> Verified Buyer
                  </span>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#143601] text-[#aad576]">
                  {offer.compatibilityScore || 94}% Match
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] space-y-1.5 text-xs font-semibold">
                <p className="text-[#4b633d] font-bold">{offer.cropName} • {offer.quantity} kg required</p>
                <p className="text-xl font-black text-[#143601]">₹{offer.offeredPrice.toLocaleString()} / Qtl</p>
                <p className="text-[#4b633d] text-[11px]">📍 {offer.distanceKm} km away</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#f4f8f0]">
              <button
                onClick={() => setActiveTab('farmer-messages')}
                className="flex-1 py-2.5 rounded-xl bg-[#f4f8f0] hover:bg-[#e2ebd9] text-[#143601] font-extrabold text-xs transition-colors text-center"
              >
                View Profile
              </button>
              <button
                onClick={() => setActiveTab('farmer-messages')}
                className="flex-1 py-2.5 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow transition-all hover:scale-[1.02] text-center"
              >
                Send Offer
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
