import React, { useState } from 'react';
import type { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { BackButton } from '../components/BackButton';
import { ArrowRight } from 'lucide-react';

interface RegisterProps {
  setActiveTab: (tab: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ setActiveTab }) => {
  const { register } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('Rajkot, Gujarat');

  const [farmSize, setFarmSize] = useState('10');
  const [primaryCrop] = useState('Tomato');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Wholesaler');

  const handleCompleteRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    register({
      name: name || 'Demo Registrant',
      email: email || `${selectedRole}@agripulse.in`,
      phone: phone || '+91 98765 00000',
      role: selectedRole,
      location: location,
      farmDetails: selectedRole === 'farmer' ? { farmSizeAcres: Number(farmSize), primaryCrops: [primaryCrop], pickupAddress: location } : undefined,
      businessDetails: selectedRole === 'buyer' ? { businessName: businessName || 'Agro Trading Co', businessType } : undefined
    });

    if (selectedRole === 'farmer') setActiveTab('farmer-dashboard');
    if (selectedRole === 'buyer') setActiveTab('buyer-dashboard');
    if (selectedRole === 'admin') setActiveTab('admin-dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6 animate-plant-grow">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab="home" setActiveTab={setActiveTab} />
        <span className="text-xs font-bold text-[#538d22] bg-[#f4f8f0] px-3 py-1 rounded-full border border-[#e2ebd9]">
          User Registration
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-[#e2ebd9] p-6 sm:p-10 space-y-8">
        
        {!selectedRole ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-black text-[#538d22] uppercase tracking-wider">
                Create an Account
              </span>
              <h2 className="text-3xl font-black text-[#143601]">What is your role?</h2>
              <p className="text-sm font-medium text-[#4b633d]">Select your primary role in the agricultural marketplace ecosystem.</p>
            </div>

            {/* 2 Roles Choice for Registration (Farmer / Buyer) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button
                onClick={() => setSelectedRole('farmer')}
                className="p-6 rounded-3xl border-2 border-[#e2ebd9] hover:border-[#538d22] bg-[#f4f8f0] text-center space-y-3 transition-all hover:scale-105"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#143601] text-white flex items-center justify-center mx-auto text-3xl">
                  👨‍🌾
                </div>
                <h3 className="font-extrabold text-base text-[#143601]">I am a Farmer</h3>
                <p className="text-xs text-[#4b633d] font-medium">Discover fair prices, list crops & sell directly to verified buyers.</p>
              </button>

              <button
                onClick={() => setSelectedRole('buyer')}
                className="p-6 rounded-3xl border-2 border-[#e2ebd9] hover:border-blue-500 bg-blue-50/50 text-center space-y-3 transition-all hover:scale-105"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto text-3xl">
                  🛒
                </div>
                <h3 className="font-extrabold text-base text-blue-950">I am a Buyer</h3>
                <p className="text-xs text-blue-900 font-medium">Source fresh produce, post buying requirements & negotiate deals.</p>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCompleteRegister} className="space-y-6 animate-plant-grow">
            <div className="flex items-center justify-between border-b border-[#e2ebd9] pb-4">
              <div>
                <span className="text-xs font-black text-[#538d22] uppercase tracking-wider">
                  Role: {selectedRole.toUpperCase()}
                </span>
                <h2 className="text-2xl font-black text-[#143601]">Complete Registration</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="text-xs font-bold text-[#538d22] hover:underline"
              >
                Change Role
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#143601] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebd9] bg-white text-sm font-semibold text-[#143601]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#143601] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebd9] bg-white text-sm font-semibold text-[#143601]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#143601] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebd9] bg-white text-sm font-semibold text-[#143601]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#143601] block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebd9] bg-white text-sm font-semibold text-[#143601]"
                />
              </div>
            </div>

            {selectedRole === 'farmer' && (
              <div className="p-4 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] space-y-4">
                <h4 className="text-xs font-black text-[#143601] uppercase">Farm Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#143601] block mb-1">Farm Location / District</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-[#e2ebd9] bg-white text-sm font-semibold text-[#143601]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#143601] block mb-1">Farm Size (Acres)</label>
                    <input
                      type="number"
                      value={farmSize}
                      onChange={(e) => setFarmSize(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-[#e2ebd9] bg-white text-sm font-semibold text-[#143601]"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'buyer' && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-4">
                <h4 className="text-xs font-black text-blue-900 uppercase">Business Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-blue-950 block mb-1">Business Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Shree Fresh Foods"
                      className="w-full px-4 py-2 rounded-xl border border-blue-200 bg-white text-sm font-semibold text-blue-950"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-blue-950 block mb-1">Business Type</label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-blue-200 bg-white text-sm font-semibold text-blue-950"
                    >
                      <option value="Wholesaler">APMC Wholesaler</option>
                      <option value="Processor">Agro Processor / Mill</option>
                      <option value="Retailer">Retail Supermarket Chain</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <span>Complete Registration & Enter Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#aad576]" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
