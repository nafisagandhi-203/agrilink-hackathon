import React from 'react';
import { CheckCircle2, ArrowRight, Receipt } from 'lucide-react';
import { StatusTimeline } from '../components/StatusTimeline';
import { useAuth } from '../context/AuthContext';
import { BackButton } from '../components/BackButton';

interface TransactionDetailProps {
  setActiveTab: (tab: string) => void;
}

export const TransactionDetail: React.FC<TransactionDetailProps> = ({ setActiveTab }) => {
  const { role } = useAuth();

  const handleArrangeTransport = () => {
    if (role === 'admin') {
      setActiveTab('admin-transport');
    } else if (role === 'buyer') {
      setActiveTab('buyer-transport');
    } else {
      setActiveTab('farmer-transport');
    }
  };

  const fallbackDashboard = role === 'admin' ? 'admin-dashboard' : role === 'buyer' ? 'buyer-dashboard' : 'farmer-dashboard';

  return (
    <div className="space-y-6 animate-plant-grow">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab={fallbackDashboard} setActiveTab={setActiveTab} />
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Verified Trade Receipt
        </span>
      </div>

      <div className="bg-[#f4f8f0] p-5 sm:p-6 rounded-3xl border border-[#e2ebd9]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#143601] text-xs font-bold border border-[#e2ebd9] mb-1.5">
          <Receipt className="w-3.5 h-3.5 text-[#538d22]" />
          <span>Digital Trade Contract</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#143601]">Transaction Summary</h1>
        <p className="text-xs text-[#4b633d] font-medium">Receipt & trade status breakdown between farmer and verified buyer.</p>
      </div>

      {/* Transaction Summary Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm space-y-5">
        
        <div className="flex items-center justify-between border-b border-[#f4f8f0] pb-4">
          <div>
            <span className="text-[10px] font-black text-[#538d22] uppercase tracking-wider block">Transaction ID</span>
            <span className="text-base font-black text-[#143601]">#TX-8001</span>
          </div>

          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#143601] text-[#aad576] border border-[#538d22] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#aad576]" /> Deal Confirmed
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
          <div>
            <span className="text-[#4b633d] block font-bold text-[10px] uppercase">Crop</span>
            <span className="text-[#143601] font-black text-sm">Tomato (500 kg)</span>
          </div>
          <div>
            <span className="text-[#4b633d] block font-bold text-[10px] uppercase">Agreed Price</span>
            <span className="text-[#538d22] font-black text-sm">₹2,550 / Qtl</span>
          </div>
          <div>
            <span className="text-[#4b633d] block font-bold text-[10px] uppercase">Farmer</span>
            <span className="text-[#143601] font-extrabold">Ramesh Patel (Rajkot)</span>
          </div>
          <div>
            <span className="text-[#4b633d] block font-bold text-[10px] uppercase">Buyer</span>
            <span className="text-[#143601] font-extrabold">Shree Fresh Foods</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] flex items-center justify-between text-xs font-black text-[#143601]">
          <span className="text-sm">Total Trade Value: ₹12,750</span>
          <button
            onClick={handleArrangeTransport}
            className="px-4 py-2.5 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold transition-all flex items-center gap-1.5 shadow cursor-pointer"
          >
            <span>Arrange Transport</span>
            <ArrowRight className="w-4 h-4 text-[#aad576]" />
          </button>
        </div>

      </div>

      {/* Compact Timeline */}
      <StatusTimeline currentStatus="In Transit" />

    </div>
  );
};
