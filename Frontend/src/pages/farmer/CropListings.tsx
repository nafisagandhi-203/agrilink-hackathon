import React, { useState } from 'react';
import { Sprout, PlusCircle, Search, Trash2, Users, Edit3 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { EmptyState } from '../../components/EmptyState';
import { CropImage } from '../../components/CropImage';
import { EditCropModal } from '../../components/EditCropModal';
import type { CropListing } from '../../types';

interface CropListingsProps {
  setActiveTab: (tab: string) => void;
}

export const CropListings: React.FC<CropListingsProps> = ({ setActiveTab }) => {
  const { crops, deleteCrop } = useData();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cropToEdit, setCropToEdit] = useState<CropListing | null>(null);

  const filteredCrops = crops.filter((c) => {
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchesSearch = c.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.variety.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-plant-grow">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f4f8f0] p-5 sm:p-6 rounded-3xl border border-[#e2ebd9]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#143601] text-xs font-bold border border-[#e2ebd9] mb-1.5">
            <Sprout className="w-3.5 h-3.5 text-[#538d22]" />
            <span>Farmgate Produce Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#143601]">
            My Crop Listings
          </h1>
          <p className="text-xs text-[#4b633d] font-medium">
            Manage active crops, monitor market pricing and find matching buyers.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('farmer-add-crop')}
          className="px-5 py-3 rounded-2xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow-md shadow-[#143601]/20 transition-all hover:scale-105 flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#aad576]" />
          <span>Add New Crop</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#538d22] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop or variety..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-xs text-[#143601] font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['All', 'Active', 'Under Negotiation', 'Sold', 'Expired'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterStatus === status
                  ? 'bg-[#143601] text-white shadow-xs font-black'
                  : 'bg-[#f4f8f0] text-[#4b633d] hover:bg-[#e2ebd9] hover:text-[#143601]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Catalog Grid */}
      {filteredCrops.length === 0 ? (
        <EmptyState
          title="No Crop Listings Found"
          description="You haven't listed any crops matching your search filter yet."
          actionText="Add Your First Crop"
          onActionClick={() => setActiveTab('farmer-add-crop')}
          icon={Sprout}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <div
              key={crop.id}
              className="p-5 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm hover:border-[#538d22] hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                <div className="relative h-40 rounded-2xl overflow-hidden bg-[#f4f8f0]">
                  <CropImage
                    src={crop.image}
                    cropName={crop.cropName}
                    alt={crop.cropName}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase shadow-sm border ${
                      crop.status === 'Active'
                        ? 'bg-[#143601] text-[#aad576] border-[#538d22]'
                        : crop.status === 'Under Negotiation'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {crop.status}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-[#143601]">
                      {crop.cropName}
                    </h3>
                    <span className="text-xs font-extrabold text-[#538d22] bg-[#f4f8f0] px-2 py-0.5 rounded border border-[#e2ebd9]">{crop.grade}</span>
                  </div>
                  <p className="text-xs text-[#4b633d] font-semibold">{crop.variety} • {crop.location}</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#4b633d] block font-bold text-[10px] uppercase">Quantity</span>
                    <span className="font-extrabold text-[#143601]">{crop.quantity} {crop.unit}</span>
                  </div>
                  <div>
                    <span className="text-[#4b633d] block font-bold text-[10px] uppercase">Expected Price</span>
                    <span className="font-black text-[#538d22]">₹{crop.expectedPrice}/q</span>
                  </div>
                  <div>
                    <span className="text-[#4b633d] block font-bold text-[10px] uppercase">Current Market</span>
                    <span className="font-bold text-[#143601]">₹{crop.currentMarketPrice}/q</span>
                  </div>
                  <div>
                    <span className="text-[#4b633d] block font-bold text-[10px] uppercase">AI Fair Est.</span>
                    <span className="font-bold text-[#245501]">₹2.4k - ₹2.6k</span>
                  </div>
                </div>

              </div>

              <div className="pt-3 border-t border-[#f4f8f0] flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveTab('farmer-buyers')}
                  className="px-4 py-2.5 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow transition-transform hover:scale-[1.01] flex items-center gap-1.5 flex-1 justify-center cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-[#aad576]" />
                  <span>Find Buyers</span>
                </button>

                <button
                  onClick={() => setCropToEdit(crop)}
                  className="p-2.5 rounded-xl text-[#143601] hover:bg-[#f4f8f0] border border-[#e2ebd9] transition-colors cursor-pointer"
                  title="Edit Crop Listing & Image"
                >
                  <Edit3 className="w-4 h-4 text-[#538d22]" />
                </button>

                <button
                  onClick={() => deleteCrop(crop.id)}
                  className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                  title="Delete Listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Edit Crop Modal */}
      <EditCropModal
        isOpen={!!cropToEdit}
        onClose={() => setCropToEdit(null)}
        crop={cropToEdit}
      />

    </div>
  );
};
