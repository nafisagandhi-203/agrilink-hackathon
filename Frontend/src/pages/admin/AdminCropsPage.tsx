import React, { useState } from 'react';
import { Package, Search, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { BackButton } from '../../components/BackButton';
import { ViewCropModal } from '../../components/ViewCropModal';
import { CropImage } from '../../components/CropImage';
import type { CropListing } from '../../types';

interface AdminCropsPageProps {
  setActiveTab: (tab: string) => void;
}

export const AdminCropsPage: React.FC<AdminCropsPageProps> = ({ setActiveTab }) => {
  const { crops, deleteCrop } = useData();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<CropListing | null>(null);

  const filteredCrops = crops.filter(
    (c) =>
      c.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-plant-grow">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab="admin-dashboard" setActiveTab={setActiveTab} />
        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Crop Listings Oversight Desk 🛡️
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#143601] flex items-center gap-2">
            <Package className="w-6 h-6 text-[#538d22]" />
            Platform Crop Listings Governance
          </h1>
          <p className="text-xs text-[#4b633d]">Monitor active farmgate listings, verify quality grades, and review price parameters.</p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-[#538d22] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`${t('search')} crop listings...`}
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#e2ebd9] bg-white text-xs font-semibold text-[#143601] focus:ring-2 focus:ring-[#538d22] focus:outline-none"
          />
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#e2ebd9] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f4f8f0] text-[#245501] uppercase font-bold">
              <tr>
                <th className="p-3">Crop Produce</th>
                <th className="p-3">Farmer Producer</th>
                <th className="p-3">Quantity & Grade</th>
                <th className="p-3">Asking Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f8f0] font-semibold">
              {filteredCrops.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#4b633d]">
                    No crop listings found.
                  </td>
                </tr>
              ) : (
                filteredCrops.map((c) => (
                  <tr key={c.id}>
                    <td className="p-3 font-bold text-[#143601] flex items-center gap-2">
                      <CropImage src={c.image} cropName={c.cropName} alt={c.cropName} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                      <span>{c.cropName}</span>
                    </td>
                    <td className="p-3">{c.farmerName}<br /><span className="text-[10px] text-[#538d22]">{c.location}</span></td>
                    <td className="p-3">{c.quantity} {c.unit}<br /><span className="text-[10px] text-[#4b633d]">Grade {c.grade}</span></td>
                    <td className="p-3 font-black text-[#538d22]">₹{c.expectedPrice}/Qtl</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === 'Active' ? 'bg-[#f4f8f0] text-[#143601] border border-[#e2ebd9]' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCrop(c)}
                          className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white text-[#143601] border border-[#e2ebd9] hover:bg-[#f4f8f0] flex items-center gap-1 cursor-pointer"
                          title={t('viewDetails')}
                        >
                          <Eye className="w-3.5 h-3.5 text-[#538d22]" />
                          <span>{t('viewDetails')}</span>
                        </button>

                        <button
                          onClick={() => deleteCrop(c.id)}
                          className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer"
                          title="Remove Listing"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ViewCropModal
        isOpen={!!selectedCrop}
        onClose={() => setSelectedCrop(null)}
        crop={selectedCrop}
      />

    </div>
  );
};
