import React, { useState } from 'react';
import { Bell, CheckCheck, Tag, CloudRain, ShieldAlert, FileText, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { BackButton } from '../components/BackButton';

interface NotificationsPageProps {
  setActiveTab: (tab: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ setActiveTab }) => {
  const { notifications, markNotificationRead } = useData();
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'offer':
        return <Tag className="w-5 h-5 text-emerald-600" />;
      case 'weather':
        return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'system':
      case 'price':
        return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      default:
        return <FileText className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-plant-grow">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab="home" setActiveTab={setActiveTab} />
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Alerts & Activity Stream
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-[#f4f8f0] p-5 sm:p-6 rounded-3xl border border-[#e2ebd9]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#143601] text-xs font-bold border border-[#e2ebd9] mb-1.5">
          <Bell className="w-3.5 h-3.5 text-[#538d22]" />
          <span>Real-Time Notifications</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#143601]">{t('notifications')}</h1>
        <p className="text-xs text-[#4b633d] font-medium">Stay updated on buyer offers, price anomalies, weather alerts, and transport tracking.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between p-2 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#143601] text-white shadow-2xs font-extrabold'
                : 'text-[#4b633d] hover:text-[#143601]'
            }`}
          >
            All Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setFilterType('unread')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'unread'
                ? 'bg-[#143601] text-white shadow-2xs font-extrabold'
                : 'text-[#4b633d] hover:text-[#143601]'
            }`}
          >
            Unread ({notifications.filter((n) => !n.read).length})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#e2ebd9] space-y-2">
            <Bell className="w-8 h-8 text-[#538d22] mx-auto" />
            <h3 className="text-sm font-extrabold text-[#143601]">No notifications found</h3>
            <p className="text-xs text-[#4b633d]">You are all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                n.read
                  ? 'bg-white border-[#e2ebd9] opacity-80'
                  : 'bg-[#f4f8f0] border-[#538d22] shadow-2xs font-bold'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-[#e2ebd9] shrink-0">
                  {getNotificationIcon(n.type)}
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-[#143601] flex items-center gap-2">
                    <span>{n.title}</span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#538d22] inline-block animate-pulse" />
                    )}
                  </h4>
                  <p className="text-xs text-[#4b633d] font-medium">{n.message}</p>
                  <span className="text-[10px] font-bold text-[#538d22]">{n.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!n.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(n.id);
                    }}
                    className="p-1.5 rounded-xl bg-white hover:bg-[#e2ebd9] text-[#143601] border border-[#e2ebd9] text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Mark as Read"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-[#538d22]" />
                  </button>
                )}
                {n.link && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(n.id);
                      setActiveTab(n.link!.replace(/^\//, '').replace(/\//g, '-'));
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#143601] text-white text-xs font-bold shadow flex items-center gap-1 cursor-pointer"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3 text-[#aad576]" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
