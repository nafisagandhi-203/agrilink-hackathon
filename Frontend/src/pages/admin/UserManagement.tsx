import React, { useState } from 'react';
import { Users, Search, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { BackButton } from '../../components/BackButton';
import { ViewProfileModal } from '../../components/ViewProfileModal';
import type { User } from '../../types';

interface UserManagementProps {
  setActiveTab: (tab: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ setActiveTab }) => {
  const { usersList, toggleUserVerification } = useData();
  const { t } = useLanguage();
  const [activeRoleTab, setActiveRoleTab] = useState<'farmer' | 'buyer'>('farmer');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = usersList.filter((u) => {
    const matchRole = u.role === activeRoleTab;
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-6 animate-plant-grow">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab="admin-dashboard" setActiveTab={setActiveTab} />
        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          {t('userGovernance')}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#143601] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#538d22]" />
            {t('userGovernance')}
          </h1>
          <p className="text-xs text-[#4b633d]">{t('userGovDesc')}</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-2 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9]">
        <div className="flex items-center gap-2">
          {(['farmer', 'buyer'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setActiveRoleTab(r)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                activeRoleTab === r
                  ? 'bg-[#143601] text-white shadow-2xs font-extrabold'
                  : 'text-[#4b633d] hover:text-[#143601]'
              }`}
            >
              {r === 'farmer' ? t('farmerRoleTitle') : t('buyerRoleTitle')}s
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <Search className="w-4 h-4 text-[#538d22] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`${t('search')} ${activeRoleTab}s...`}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#e2ebd9] bg-white text-xs font-semibold text-[#143601] focus:ring-2 focus:ring-[#538d22] focus:outline-none"
          />
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#e2ebd9] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f4f8f0] text-[#245501] uppercase font-bold">
              <tr>
                <th className="p-3">User Name</th>
                <th className="p-3">Email & Phone</th>
                <th className="p-3">Location</th>
                <th className="p-3">Verification Badge</th>
                <th className="p-3">Joined Date</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f8f0] font-semibold">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#4b633d]">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="p-3 font-bold text-[#143601] flex items-center gap-2">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'User')}&background=538d22&color=fff&bold=true&size=64`}
                        alt={u.name}
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'User')}&background=538d22&color=fff&bold=true&size=64`;
                        }}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#e2ebd9]"
                      />
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

      {/* Profile Modal */}
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
          farmDetails: selectedUser.farmDetails,
          businessDetails: selectedUser.businessDetails
        } : null}
      />

    </div>
  );
};
