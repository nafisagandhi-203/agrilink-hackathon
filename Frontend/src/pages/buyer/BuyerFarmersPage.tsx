import React, { useState } from 'react';
import { Sprout, Search, CheckCircle2, Eye, MapPin, Phone } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { BackButton } from '../../components/BackButton';
import { ViewProfileModal } from '../../components/ViewProfileModal';
import type { User } from '../../types';

interface BuyerFarmersPageProps {
  setActiveTab: (tab: string) => void;
}

export const BuyerFarmersPage: React.FC<BuyerFarmersPageProps> = ({ setActiveTab }) => {
  const { usersList, crops } = useData();
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState<User | null>(null);

  const farmerUsers = usersList.filter((u) => u.role === 'farmer');
  
  const filteredFarmers = farmerUsers.filter((f) => {
    return (
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-plant-grow">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab="buyer-dashboard" setActiveTab={setActiveTab} />
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          {t('farmers')} Sourcing Directory
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-[#f4f8f0] p-5 sm:p-6 rounded-3xl border border-[#e2ebd9]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#143601] text-xs font-bold border border-[#e2ebd9] mb-1.5">
          <Sprout className="w-3.5 h-3.5 text-[#538d22]" />
          <span>Verified Producer Network</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#143601]">{t('farmers')}</h1>
        <p className="text-xs text-[#4b633d] font-medium">Connect directly with verified Indian farmgate producers and harvest suppliers.</p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#538d22] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`${t('search')} farmers by name or location (e.g. Ramesh, Rajkot)...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-xs font-bold text-[#143601] focus:ring-2 focus:ring-[#538d22] focus:outline-none"
          />
        </div>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFarmers.map((farmer) => {
          const farmerCrops = crops.filter((c) => c.farmerId === farmer.id || c.farmerName === farmer.name);
          return (
            <div
              key={farmer.id}
              className="p-5 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm hover:border-[#538d22] hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#5F8D4E] text-white font-black text-lg flex items-center justify-center shadow-xs shrink-0">
                    {farmer.name?.[0] || 'F'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-base text-[#143601] truncate flex items-center gap-1.5">
                      <span>{farmer.name}</span>
                      <CheckCircle2 className="w-4 h-4 text-[#538d22] shrink-0" />
                    </h3>
                    <p className="text-xs text-[#4b633d] font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#538d22]" />
                      <span>{farmer.location}</span>
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] space-y-1 text-xs font-semibold">
                  <p className="text-[#4b633d] text-[11px] font-bold">Active Listings ({farmerCrops.length})</p>
                  <p className="text-[#143601] font-black">
                    {farmerCrops.map((c) => c.cropName).join(', ') || 'Tomato, Wheat, Cotton'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#f4f8f0]">
                <button
                  onClick={() => setSelectedFarmer(farmer)}
                  className="flex-1 py-2.5 rounded-xl bg-[#f4f8f0] hover:bg-[#e2ebd9] text-[#143601] font-extrabold text-xs transition-colors text-center flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#538d22]" />
                  <span>{t('viewProfile')}</span>
                </button>

                <a
                  href={`tel:${farmer.phone.replace(/\s+/g, '')}`}
                  className="flex-1 py-2.5 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-[#aad576]" />
                  <span>{t('callNow')}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Modal */}
      <ViewProfileModal
        isOpen={!!selectedFarmer}
        onClose={() => setSelectedFarmer(null)}
        profileData={selectedFarmer ? {
          name: selectedFarmer.name,
          role: 'farmer',
          phone: selectedFarmer.phone,
          email: selectedFarmer.email,
          location: selectedFarmer.location,
          verified: selectedFarmer.verified,
          joinedDate: selectedFarmer.joinedDate,
          farmDetails: selectedFarmer.farmDetails || { pickupAddress: selectedFarmer.location }
        } : null}
      />

    </div>
  );
};
