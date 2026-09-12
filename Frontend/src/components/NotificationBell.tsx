import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, TrendingUp, Truck, DollarSign, AlertTriangle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export const NotificationBell: React.FC = () => {
  const { notifications, markNotificationRead } = useData();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userNotifications = notifications.filter(
    (n) => n.userId === user?.id || n.role === user?.role || n.role === 'all'
  );

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'offer':
        return <DollarSign className="w-4 h-4 text-[#538d22]" />;
      case 'price':
        return <TrendingUp className="w-4 h-4 text-[#245501]" />;
      case 'transport':
        return <Truck className="w-4 h-4 text-amber-600" />;
      case 'price_alert':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-[#538d22]" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-[#f4f8f0] text-[#143601] hover:bg-[#e2ebd9] transition-all border border-[#e2ebd9] focus:outline-none"
        aria-label="Notifications"
        title="View Notifications"
      >
        <Bell className="w-5 h-5 text-[#143601]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-[#e2ebd9] py-2 z-50 animate-plant-grow">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#f4f8f0]">
            <h3 className="font-extrabold text-xs text-[#143601] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#538d22]" />
              Notifications ({unreadCount} unread)
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => userNotifications.forEach((n) => markNotificationRead(n.id))}
                className="text-xs text-[#538d22] font-bold hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#f4f8f0]">
            {userNotifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#4b633d] font-semibold">
                No notifications right now.
              </div>
            ) : (
              userNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-3.5 hover:bg-[#f4f8f0] transition-colors cursor-pointer flex gap-3 ${
                    !n.read ? 'bg-[#f4f8f0]/80 font-bold' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white border border-[#e2ebd9] shrink-0 h-fit">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-extrabold text-[#143601] truncate">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-[#4b633d] shrink-0 font-medium">{n.date}</span>
                    </div>
                    <p className="text-xs text-[#4b633d] font-medium line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
