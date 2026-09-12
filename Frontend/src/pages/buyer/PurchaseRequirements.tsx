import React, { useState } from 'react';
import { PlusCircle, Sparkles, ShoppingBag } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface PurchaseRequirementsProps {
  setActiveTab: (tab: string) => void;
}

export const PurchaseRequirements: React.FC<PurchaseRequirementsProps> = ({ setActiveTab }) => {
  const { buyerRequirements, addRequirement } = useData();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const [cropName, setCropName] = useState('Tomato');
  const [quantity, setQuantity] = useState('500');
  const [unit, setUnit] = useState('kg');
  const [grade, setGrade] = useState('Grade A');
  const [preferredLocation, setPreferredLocation] = useState('Rajkot / Saurashtra');
  const [offeredPrice, setOfferedPrice] = useState('2550');
  const [purchaseDate, setPurchaseDate] = useState('2026-09-14');
  const [deliveryReq] = useState('Farmgate pickup required');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRequirement({
      buyerId: user?.id || 'usr-buyer-1',
      buyerName: user?.businessDetails?.businessName || user?.name || 'Shree Fresh Foods',
      verified: true,
      cropName,
      quantity: Number(quantity),
      unit,
      grade,
      preferredLocation,
      offeredPrice: Number(offeredPrice),
      purchaseDate,
      deliveryRequirement: deliveryReq,
      status: 'Active'
    });
    setShowForm(false);
    setActiveTab('buyer-farmers');
  };

  return (
    <div className="space-y-6 animate-plant-grow">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f4f8f0] p-5 sm:p-6 rounded-3xl border border-[#e2ebd9]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#143601] text-xs font-bold border border-[#e2ebd9] mb-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-[#538d22]" />
            <span>Sourcing Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#143601]">
            Purchase Requirements Engine
          </h1>
          <p className="text-xs text-[#4b633d] font-medium">Post buying specifications to receive AI matching farmers across Gujarat.</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-3 rounded-2xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow-md shadow-[#143601]/20 transition-all hover:scale-105 flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#aad576]" />
          <span>{showForm ? 'Close Form' : 'Post New Requirement'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2ebd9] shadow-xl space-y-4 animate-in fade-in duration-200">
          <h3 className="text-lg font-black text-[#143601] border-b border-[#f4f8f0] pb-3">
            Post Purchase Specification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">Crop Required</label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
              >
                <option value="Tomato">🍅 Tomato</option>
                <option value="Wheat">🌾 Wheat</option>
                <option value="Onion">🧅 Onion</option>
                <option value="Potato">🥔 Potato</option>
                <option value="Cotton">🌱 Cotton</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">Quantity Required</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-extrabold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-24 px-3 py-2.5 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
                >
                  <option value="kg">kg</option>
                  <option value="quintal">quintal</option>
                  <option value="ton">ton</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">Quality / Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
              >
                <option value="Grade A">Grade A (Export / Retail Quality)</option>
                <option value="Grade B">Grade B (Processing Grade)</option>
                <option value="Premium">Premium Organic Grade</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">Offered Price (₹ per quintal)</label>
              <input
                type="number"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#538d22] text-xs font-black focus:ring-2 focus:ring-[#538d22] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">Preferred Location</label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">Target Purchase Date</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-[#143601] hover:bg-[#1a4301] text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
          >
            <Sparkles className="w-4 h-4 text-[#aad576]" />
            <span>Find Matching Farmers</span>
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {buyerRequirements.map((req) => (
          <div
            key={req.id}
            className="p-6 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm hover:border-[#538d22] hover:shadow-lg transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-black text-base text-[#143601]">
                {req.cropName} ({req.quantity} {req.unit})
              </h4>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#f4f8f0] text-[#143601] border border-[#e2ebd9]">
                {req.status}
              </span>
            </div>

            <p className="text-xs text-[#4b633d] font-semibold">
              Offered Price: <strong className="text-[#538d22] text-sm">₹{req.offeredPrice}/q</strong> • Grade: {req.grade}
            </p>
            <p className="text-xs text-[#4b633d] font-semibold">📍 Preferred Location: {req.preferredLocation}</p>

            <button
              onClick={() => setActiveTab('buyer-farmers')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#f4f8f0] hover:bg-[#e2ebd9] text-[#143601] font-extrabold text-xs transition-colors"
            >
              View AI Matched Farmers (94% Match)
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
