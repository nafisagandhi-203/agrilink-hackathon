import React, { useState } from 'react';
import { Save, LogOut, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface ProfileProps {
  setActiveTab?: (tab: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ setActiveTab }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    if (setActiveTab) {
      setActiveTab('role-selection');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4 py-6 animate-plant-grow">
      
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2ebd9] shadow-xl space-y-6">
        
        {/* Profile Avatar & Header Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <img
              loading="lazy"
              decoding="async"
              src={user?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200'}
              alt={user?.name || 'User'}
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=538d22&color=fff&bold=true&size=128`;
              }}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-[#aad576]/60 shadow-md"
            />

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black text-[#143601]">{name}</h2>
                {user?.verified && (
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-[#f4f8f0] text-[#538d22] border border-[#e2ebd9] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#538d22]" /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs font-extrabold text-[#538d22] capitalize flex items-center justify-center sm:justify-start gap-1">
                <UserCheck className="w-3.5 h-3.5 text-[#538d22]" />
                <span>{user?.role} Account</span>
              </p>
              <p className="text-xs text-[#4b633d] font-semibold">{user?.email}</p>
            </div>
          </div>

          {/* Quick Logout Button in Header */}
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs border border-rose-200 shadow-2xs transition-all hover:scale-105 flex items-center gap-2 shrink-0"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>{t('logout')}</span>
          </button>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#f4f8f0] text-xs font-semibold">
          <div>
            <label className="text-[#4b633d] font-bold block mb-1 uppercase tracking-wider text-[10px]">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
              />
            ) : (
              <p className="font-extrabold text-[#143601] text-sm">{name}</p>
            )}
          </div>

          <div>
            <label className="text-[#4b633d] font-bold block mb-1 uppercase tracking-wider text-[10px]">Phone Number</label>
            {isEditing ? (
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
              />
            ) : (
              <p className="font-extrabold text-[#143601] text-sm">{phone}</p>
            )}
          </div>

          <div>
            <label className="text-[#4b633d] font-bold block mb-1 uppercase tracking-wider text-[10px]">Registered Location</label>
            {isEditing ? (
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
              />
            ) : (
              <p className="font-extrabold text-[#143601] text-sm">{location}</p>
            )}
          </div>

          <div>
            <label className="text-[#4b633d] font-bold block mb-1 uppercase tracking-wider text-[10px]">Member Since</label>
            <p className="font-extrabold text-[#143601] text-sm">{user?.joinedDate}</p>
          </div>
        </div>

        {/* Role Specific Details */}
        {user?.role === 'farmer' && user.farmDetails && (
          <div className="p-4.5 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] text-xs space-y-2">
            <h4 className="font-black text-[#143601] uppercase tracking-wider text-[11px]">Farm Profile</h4>
            <p className="text-[#4b633d]"><strong>Farm Size:</strong> <span className="text-[#143601] font-bold">{user.farmDetails.farmSizeAcres} Acres</span></p>
            <p className="text-[#4b633d]"><strong>Primary Crops:</strong> <span className="text-[#143601] font-bold">{user.farmDetails.primaryCrops.join(', ')}</span></p>
            <p className="text-[#4b633d]"><strong>Pickup Address:</strong> <span className="text-[#143601] font-bold">{user.farmDetails.pickupAddress}</span></p>
          </div>
        )}

        {user?.role === 'buyer' && user.businessDetails && (
          <div className="p-4.5 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] text-xs space-y-2">
            <h4 className="font-black text-[#143601] uppercase tracking-wider text-[11px]">Business Profile</h4>
            <p className="text-[#4b633d]"><strong>Business Name:</strong> <span className="text-[#143601] font-bold">{user.businessDetails.businessName}</span></p>
            <p className="text-[#4b633d]"><strong>GST Number:</strong> <span className="text-[#143601] font-bold">{user.businessDetails.gstNumber}</span></p>
            <p className="text-[#4b633d]"><strong>Type:</strong> <span className="text-[#143601] font-bold">{user.businessDetails.businessType}</span></p>
          </div>
        )}

        {/* Actions Bar */}
        <div className="pt-4 flex items-center justify-between border-t border-[#f4f8f0]">
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow transition-all hover:scale-105 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout')} & Select Role</span>
          </button>

          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Save className="w-4 h-4 text-[#aad576]" /> Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 rounded-xl bg-[#f4f8f0] hover:bg-[#e2ebd9] text-[#143601] font-extrabold text-xs border border-[#e2ebd9] transition-all hover:scale-105"
            >
              Edit Profile
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
