import React, { useState } from 'react';
import { Search, Filter, ShoppingBag, Eye, Send } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { ViewProfileModal } from '../../components/ViewProfileModal';
import { ViewCropModal } from '../../components/ViewCropModal';
import { SendOfferModal } from '../../components/SendOfferModal';
import { CropImage } from '../../components/CropImage';
import type { CropListing } from '../../types';

interface MarketplaceProps {
  setActiveTab: (tab: string) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ setActiveTab }) => {
  const { crops } = useData();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals state
  const [selectedCropForView, setSelectedCropForView] = useState<CropListing | null>(null);
  const [selectedCropForOffer, setSelectedCropForOffer] = useState<CropListing | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);

  const filteredCrops = crops.filter((c) => {
    const matchesSearch =
      c.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || c.cropName === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-plant-grow">
      
      {/* Header */}
      <div className="bg-[#f4f8f0] p-5 sm:p-6 rounded-3xl border border-[#e2ebd9]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#143601] text-xs font-bold border border-[#e2ebd9] mb-1.5">
          <ShoppingBag className="w-3.5 h-3.5 text-[#538d22]" />
          <span>{t('directFarmerPortal')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#143601]">{t('marketplace')}</h1>
        <p className="text-xs text-[#4b633d] font-medium">{t('buyerBannerDesc')}</p>
      </div>

      {/* Search Bar & Quick Filters */}
      <div className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#538d22] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${t('search')} produce (e.g. Tomato, Rajkot)...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-xs font-bold text-[#143601] focus:ring-2 focus:ring-[#538d22] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#538d22] shrink-0" />
          {['All', 'Tomato', 'Wheat', 'Onion', 'Potato'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#143601] text-white shadow-xs'
                  : 'bg-[#f4f8f0] text-[#4b633d] border border-[#e2ebd9] hover:bg-[#e2ebd9] hover:text-[#143601]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Crop Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCrops.map((crop) => (
          <div
            key={crop.id}
            className="p-5 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm hover:border-[#538d22] hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CropImage
                  src={crop.image}
                  cropName={crop.cropName}
                  alt={crop.cropName}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-[#e2ebd9]"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-base text-[#143601] truncate">{crop.cropName}</h3>
                  <p className="text-xs text-[#4b633d] font-semibold truncate">👨‍🌾 {crop.farmerName} • {crop.location || 'Rajkot'}</p>
                  <span className="text-[10px] font-extrabold text-[#538d22] bg-[#f4f8f0] px-2 py-0.5 rounded border border-[#e2ebd9] inline-block mt-0.5">
                    Grade {crop.grade} Quality
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] grid grid-cols-2 gap-2 text-xs font-semibold">
                <div>
                  <span className="text-[#4b633d] block font-bold text-[10px] uppercase">Quantity</span>
                  <span className="text-[#143601] font-black">{crop.quantity} {crop.unit}</span>
                </div>
                <div>
                  <span className="text-[#4b633d] block font-bold text-[10px] uppercase">{t('expectedPrice')}</span>
                  <span className="text-[#538d22] font-black">₹{crop.expectedPrice.toLocaleString()} / Qtl</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#f4f8f0]">
              <button
                onClick={() => setSelectedCropForView(crop)}
                className="flex-1 py-2.5 rounded-xl bg-[#f4f8f0] hover:bg-[#e2ebd9] text-[#143601] font-extrabold text-xs transition-colors text-center flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#538d22]" />
                <span>{t('viewDetails')}</span>
              </button>
              
              <button
                onClick={() => setSelectedCropForOffer(crop)}
                className="flex-1 py-2.5 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow transition-transform hover:scale-[1.02] text-center flex items-center justify-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('makeOffer')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <ViewCropModal
        isOpen={!!selectedCropForView}
        onClose={() => setSelectedCropForView(null)}
        crop={selectedCropForView}
        onMakeOffer={(c) => setSelectedCropForOffer(c)}
        onContactFarmer={(c) => setSelectedProfile({
          name: c.farmerName,
          role: 'farmer',
          phone: '+91 98765 43210',
          email: `${c.farmerName.toLowerCase().replace(/\s+/g, '')}@agripulse.in`,
          location: c.location || 'Rajkot, Gujarat',
          verified: true,
          farmDetails: { pickupAddress: c.pickupLocation || c.location }
        })}
      />

      <SendOfferModal
        isOpen={!!selectedCropForOffer}
        onClose={() => setSelectedCropForOffer(null)}
        crop={selectedCropForOffer}
        onSuccess={() => setActiveTab('buyer-offers')}
      />

      <ViewProfileModal
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        profileData={selectedProfile}
      />

    </div>
  );
};
