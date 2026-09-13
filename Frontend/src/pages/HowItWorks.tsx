import React from 'react';
import { Sprout, BrainCircuit, Users, MessageSquare, ShieldCheck, Truck, PackageCheck, ArrowDown, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  setActiveTab: (tab: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ setActiveTab }) => {
  const steps = [
    { num: '01', title: '👨‍🌾 Farmer Lists Crop', desc: 'Farmer adds crop variety, quantity, quality grade and farm location.', icon: Sprout },
    { num: '02', title: '🤖 AI Price Intelligence', desc: 'Engine analyzes APMC arrivals, demand trends & predicts 7-day fair price bounds.', icon: BrainCircuit },
    { num: '03', title: '👥 Find Best Buyer Match', desc: 'AI ranks buyers based on compatibility score %, offered price & distance.', icon: Users },
    { num: '04', title: '💬 Direct Negotiation', desc: 'Farmer and Buyer chat in real-time with embedded interactive counter-offer cards.', icon: MessageSquare },
    { num: '05', title: '🤝 Confirm Deal', desc: 'Both parties accept the offer card to lock price & generate digital transaction receipt.', icon: ShieldCheck },
    { num: '06', title: '🚚 Arrange Transport', desc: 'Farmer selects verified local transporter (Tata 407, Pickup, etc.) with calculated route & ETA.', icon: Truck },
    { num: '07', title: '📦 Delivery & Payment', desc: 'Real-time shipment tracking from farmgate pickup to buyer warehouse delivery.', icon: PackageCheck }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 px-4 py-8 animate-plant-grow">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#f4f8f0] text-[#143601] border border-[#e2ebd9]">
          Platform Architecture Flow
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#143601]">How AgriPulse Works</h1>
        <p className="text-xs sm:text-sm text-[#4b633d] font-medium">End-to-end transparent journey from crop listing to final delivery payment.</p>
      </div>

      <div className="space-y-6 relative">
        {steps.map((step, idx) => (
          <React.Fragment key={step.num}>
            <div className="p-6 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm hover:border-[#538d22] hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-[#143601] text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                {step.num}
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-black text-[#143601]">{step.title}</h3>
                <p className="text-xs text-[#4b633d] font-medium leading-relaxed">{step.desc}</p>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex justify-center text-[#538d22] animate-bounce">
                <ArrowDown className="w-5 h-5 text-[#538d22]" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#143601] via-[#1a4301] to-[#245501] text-white text-center space-y-4 shadow-xl border border-[#538d22]/40">
        <h3 className="text-2xl font-black text-[#aad576] ">Ready to Experience AgriPulse?</h3>
        <p className="text-xs text-[#aad576] font-medium">Try our SIH Demo Mode or register as a Farmer or Buyer.</p>
        <button
          onClick={() => setActiveTab('role-selection')}
          className="px-8 py-3.5 rounded-2xl bg-[#538d22] hover:bg-[#73a942] text-white font-extrabold text-xs shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2"
        >
          <span>Get Started Now</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>

    </div>
  );
};
