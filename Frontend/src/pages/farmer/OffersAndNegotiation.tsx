import React, { useState } from 'react';
import { Send, Check, X, RefreshCw, MessageSquare, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { ViewProfileModal } from '../../components/ViewProfileModal';

interface OffersAndNegotiationProps {
  setActiveTab: (tab: string) => void;
}

export const OffersAndNegotiation: React.FC<OffersAndNegotiationProps> = ({ setActiveTab }) => {
  const { buyerOffers } = useData();
  const { t } = useLanguage();

  const [activeOfferId, setActiveOfferId] = useState(buyerOffers[0]?.id || 'off-1');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'buyer', text: 'Hello Rameshji, we are interested in your 500 kg Grade A Tomato.' },
    { id: 2, sender: 'farmer', text: 'Hello Shree Fresh Foods, my asking price is ₹2,600 / quintal.' },
    { id: 3, sender: 'buyer', text: 'We submit our offer card below.' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [dealStatus, setDealStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const selectedOffer = buyerOffers.find((o) => o.id === activeOfferId) || buyerOffers[0];

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'farmer', text: inputMsg }]);
    setInputMsg('');
  };

  return (
    <div className="space-y-6 animate-plant-grow">
      
      <div className="bg-[#f4f8f0] p-5 sm:p-6 rounded-3xl border border-[#e2ebd9]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#143601] text-xs font-bold border border-[#e2ebd9] mb-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-[#538d22]" />
          <span>Real-Time Deal Room</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#143601]">{t('offersAndNegotiation')}</h1>
        <p className="text-xs text-[#4b633d] font-medium">Direct offer negotiation with wholesale buyers with instant counter-offer cards.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 bg-white rounded-3xl border border-[#e2ebd9] shadow-sm overflow-hidden">
        
        {/* Left: Active Offers List */}
        <div className="border-r border-[#e2ebd9] p-4 space-y-3 bg-[#f4f8f0]/50">
          <h2 className="text-[10px] font-black text-[#538d22] uppercase tracking-wider">{t('pendingOffers')}</h2>
          <div className="space-y-2">
            {buyerOffers.length === 0 ? (
              <p className="text-xs text-[#4b633d] p-3 text-center">No active buyer offers right now.</p>
            ) : (
              buyerOffers.map((off) => (
                <button
                  key={off.id}
                  onClick={() => setActiveOfferId(off.id)}
                  className={`w-full p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    activeOfferId === off.id
                      ? 'bg-white border-[#538d22] shadow-xs font-extrabold text-[#143601]'
                      : 'bg-white/80 border-[#e2ebd9] hover:bg-[#f4f8f0] text-[#4b633d]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-[#143601] truncate">{off.buyerName}</span>
                    <span className="text-[10px] font-black text-[#538d22] bg-[#f4f8f0] px-1.5 py-0.2 rounded border border-[#e2ebd9]">
                      ₹{off.offeredPrice}/q
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4b633d] font-medium mt-1">
                    {off.cropName} • {off.quantity} {off.unit}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right 2 Columns: Chat & Offer Card */}
        <div className="lg:col-span-2 flex flex-col h-[500px]">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-[#e2ebd9] bg-[#f4f8f0] flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-[#143601] flex items-center gap-2">
                <span>{selectedOffer?.buyerName || 'No Active Offer'}</span>
                {selectedOffer && (
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="p-1 rounded-lg bg-white hover:bg-[#e2ebd9] border border-[#e2ebd9] text-[#538d22] cursor-pointer"
                    title={t('viewProfile')}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}
              </h3>
              <p className="text-[11px] text-[#4b633d] font-semibold">
                {selectedOffer ? `${selectedOffer.cropName} • ${selectedOffer.quantity} ${selectedOffer.unit} • Delivery: ${selectedOffer.deliveryDate}` : 'No active offer selected'}
              </p>
            </div>
            {dealStatus === 'accepted' && (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#143601] text-[#aad576]">
                ✓ {t('dealConfirmed')}
              </span>
            )}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'farmer' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2.5 rounded-2xl text-xs font-medium ${
                    m.sender === 'farmer'
                      ? 'bg-[#143601] text-white rounded-br-none font-semibold'
                      : 'bg-[#f4f8f0] text-[#143601] border border-[#e2ebd9] rounded-bl-none font-semibold'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Offer Card embedded inside chat */}
            {selectedOffer && (
              <div className="p-4 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] space-y-3 max-w-sm mx-auto my-2 shadow-2xs">
                <div className="text-center space-y-0.5">
                  <span className="text-[10px] font-black text-[#538d22] uppercase tracking-wider block">Buyer Official Offer Card</span>
                  <span className="text-2xl font-black text-[#143601]">₹{selectedOffer.offeredPrice} / Qtl</span>
                  <p className="text-xs text-[#4b633d] font-semibold">{selectedOffer.quantity} {selectedOffer.unit} {selectedOffer.cropName}</p>
                </div>

                {dealStatus === 'pending' ? (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setDealStatus('accepted');
                        setActiveTab('farmer-transactions');
                      }}
                      className="flex-1 py-2 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-[#aad576]" /> Accept
                    </button>
                    <button
                      onClick={() => setDealStatus('rejected')}
                      className="flex-1 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs border border-rose-200 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => setInputMsg(`I counter offer ₹${selectedOffer.offeredPrice + 50} / quintal.`)}
                      className="py-2 px-3 rounded-xl bg-white border border-[#e2ebd9] text-[#143601] font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#538d22]" /> Counter
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-xs font-black text-[#143601]">
                    {dealStatus === 'accepted' ? '✓ Offer Accepted! Proceeding to Transport' : '✕ Offer Rejected'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-[#e2ebd9] bg-[#f4f8f0] flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message or counter price..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#e2ebd9] bg-white text-xs font-semibold text-[#143601] focus:outline-none focus:ring-2 focus:ring-[#538d22]"
            />
            <button
              onClick={handleSendMessage}
              className="p-2.5 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-bold transition-all shadow cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#aad576]" />
            </button>
          </div>

        </div>

      </div>

      {/* View Profile Modal */}
      <ViewProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profileData={selectedOffer ? {
          name: selectedOffer.buyerName,
          role: 'buyer',
          phone: '+91 98123 45678',
          email: `${selectedOffer.buyerName.toLowerCase().replace(/\s+/g, '')}@agripulse.in`,
          location: 'Rajkot APMC Mandi, Gujarat',
          verified: selectedOffer.buyerVerified,
          businessDetails: {
            businessName: selectedOffer.buyerName,
            gstNumber: '24AAACB1234C1Z5'
          }
        } : null}
      />

    </div>
  );
};
