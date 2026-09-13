import React, { useState } from 'react';
import { Building2, Search, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { BackButton } from '../../components/BackButton';
import { ViewProfileModal } from '../../components/ViewProfileModal';
import type { User } from '../../types';

interface AdminBuyersPageProps {
  setActiveTab: (tab: string) => void;
}

export const AdminBuyersPage: React.FC<AdminBuyersPageProps> = ({ setActiveTab }) => {
  const { usersList, toggleUserVerification } = useData();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const buyerUsers = usersList.filter((u) => u.role === 'buyer');
  const filteredBuyers = buyerUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-plant-grow">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab="admin-dashboard" setActiveTab={setActiveTab} />
        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Buyer Sourcing Governance Desk 🛡️
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#143601] flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#538d22]" />
            Wholesale Buyer & Processor Verification
          </h1>
          <p className="text-xs text-[#4b633d]">Verify GST licenses, business registration, APMC trader permits, and buyer compliance.</p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-[#538d22] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`${t('search')} buyers...`}
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#e2ebd9] bg-white text-xs font-semibold text-[#143601] focus:ring-2 focus:ring-[#538d22] focus:outline-none"
          />
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#e2ebd9] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f4f8f0] text-[#245501] uppercase font-bold">
              <tr>
                <th className="p-3">Buyer Company</th>
                <th className="p-3">Contact & Email</th>
                <th className="p-3">Location</th>
                <th className="p-3">Verification Badge</th>
                <th className="p-3">Joined Date</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f8f0] font-semibold">
              {filteredBuyers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#4b633d]">
                    No wholesale buyers found.
                  </td>
                </tr>
              ) : (
                filteredBuyers.map((u) => (
                  <tr key={u.id}>
                    <td className="p-3 font-bold text-[#143601] flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-black">
                        {u.name?.[0] || 'B'}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="p-3">{u.email}<br /><span className="text-[10px] text-[#538d22]">{u.phone}</span></td>
                    <td className="p-3">{u.location}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.verified ? 'bg-[#f4f8f0] text-[#143601] border border-[#e2ebd9]' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {u.verified ? t('verifiedBadge') : t('pendingVerification')}
                      </span>
                    </td>
                    <td className="p-3 text-[#4b633d]">{u.joinedDate}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white text-[#143601] border border-[#e2ebd9] hover:bg-[#f4f8f0] flex items-center gap-1 cursor-pointer"
                          title={t('viewProfile')}
                        >
                          <Eye className="w-3.5 h-3.5 text-[#538d22]" />
                          <span>{t('viewProfile')}</span>
                        </button>

                        <button
                          onClick={() => toggleUserVerification(u.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                            u.verified ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-[#143601] text-white shadow'
                          }`}
                        >
                          {u.verified ? t('revokeVerification') : t('verifyCredentials')}
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

      <ViewProfileModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        profileData={selectedUser ? {
          name: selectedUser.name,
          role: selectedUser.role,
          phone: selectedUser.phone,
          email: selectedUser.email,
          location: selectedUser.location,
          verified: selectedUser.verified,
          joinedDate: selectedUser.joinedDate,
          businessDetails: selectedUser.businessDetails
        } : null}
      />

    </div>
  );
};
