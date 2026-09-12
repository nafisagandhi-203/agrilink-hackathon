import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  CropListing,
  BuyerRequirement,
  BuyerOffer,
  ChatMessage,
  Transaction,
  TransportBooking,
  AbnormalPriceAlert,
  Notification,
  User
} from '../types';
import {
  mockCrops,
  mockBuyerRequirements,
  mockBuyerOffers,
  mockChatMessages,
  mockTransactions,
  mockTransportBookings,
  mockAbnormalAlerts,
  mockNotifications,
  mockUsers
} from '../data/mockData';

interface DataContextType {
  crops: CropListing[];
  buyerRequirements: BuyerRequirement[];
  buyerOffers: BuyerOffer[];
  chatMessages: Record<string, ChatMessage[]>;
  transactions: Transaction[];
  transportBookings: TransportBooking[];
  alerts: AbnormalPriceAlert[];
  notifications: Notification[];
  usersList: User[];
  
  addCrop: (crop: Omit<CropListing, 'id' | 'createdAt'>) => CropListing;
  updateCrop: (id: string, updates: Partial<CropListing>) => void;
  deleteCrop: (id: string) => void;
  addRequirement: (req: Omit<BuyerRequirement, 'id' | 'createdAt'>) => void;
  sendOffer: (offer: Omit<BuyerOffer, 'id' | 'createdAt'>) => void;
  updateOfferStatus: (offerId: string, status: BuyerOffer['status']) => void;
  sendChatMessage: (buyerId: string, message: Omit<ChatMessage, 'id'>) => void;
  createTransactionFromOffer: (offer: BuyerOffer, farmerPhone: string, farmerLocation: string, buyerPhone: string, buyerLocation: string) => Transaction;
  bookTransport: (booking: Omit<TransportBooking, 'id' | 'bookingDate'>) => TransportBooking;
  updateTransportStatus: (bookingId: string, status: TransportBooking['status']) => void;
  dismissAlert: (alertId: string) => void;
  markNotificationRead: (id: string) => void;
  toggleUserVerification: (userId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [crops, setCrops] = useState<CropListing[]>(() => {
    const saved = localStorage.getItem('agripulse_crops');
    return saved ? JSON.parse(saved) : mockCrops;
  });

  const [buyerRequirements, setBuyerRequirements] = useState<BuyerRequirement[]>(() => {
    const saved = localStorage.getItem('agripulse_requirements');
    return saved ? JSON.parse(saved) : mockBuyerRequirements;
  });

  const [buyerOffers, setBuyerOffers] = useState<BuyerOffer[]>(() => {
    const saved = localStorage.getItem('agripulse_offers');
    return saved ? JSON.parse(saved) : mockBuyerOffers;
  });

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('agripulse_chat');
    return saved ? JSON.parse(saved) : mockChatMessages;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('agripulse_transactions');
    return saved ? JSON.parse(saved) : mockTransactions;
  });

  const [transportBookings, setTransportBookings] = useState<TransportBooking[]>(() => {
    const saved = localStorage.getItem('agripulse_transport');
    return saved ? JSON.parse(saved) : mockTransportBookings;
  });

  const [alerts, setAlerts] = useState<AbnormalPriceAlert[]>(() => {
    const saved = localStorage.getItem('agripulse_alerts');
    return saved ? JSON.parse(saved) : mockAbnormalAlerts;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('agripulse_notifications');
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [usersList, setUsersList] = useState<User[]>(() => {
    const saved = localStorage.getItem('agripulse_users_list');
    return saved ? JSON.parse(saved) : mockUsers;
  });

  useEffect(() => { localStorage.setItem('agripulse_crops', JSON.stringify(crops)); }, [crops]);
  useEffect(() => { localStorage.setItem('agripulse_requirements', JSON.stringify(buyerRequirements)); }, [buyerRequirements]);
  useEffect(() => { localStorage.setItem('agripulse_offers', JSON.stringify(buyerOffers)); }, [buyerOffers]);
  useEffect(() => { localStorage.setItem('agripulse_chat', JSON.stringify(chatMessages)); }, [chatMessages]);
  useEffect(() => { localStorage.setItem('agripulse_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('agripulse_transport', JSON.stringify(transportBookings)); }, [transportBookings]);
  useEffect(() => { localStorage.setItem('agripulse_alerts', JSON.stringify(alerts)); }, [alerts]);
  useEffect(() => { localStorage.setItem('agripulse_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('agripulse_users_list', JSON.stringify(usersList)); }, [usersList]);

  const addCrop = (newCropData: Omit<CropListing, 'id' | 'createdAt'>): CropListing => {
    const newCrop: CropListing = {
      ...newCropData,
      id: `crop-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCrops((prev) => [newCrop, ...prev]);
    return newCrop;
  };

  const updateCrop = (id: string, updates: Partial<CropListing>) => {
    setCrops((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCrop = (id: string) => {
    setCrops((prev) => prev.filter((c) => c.id !== id));
  };

  const addRequirement = (reqData: Omit<BuyerRequirement, 'id' | 'createdAt'>) => {
    const newReq: BuyerRequirement = {
      ...reqData,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBuyerRequirements((prev) => [newReq, ...prev]);
  };

  const sendOffer = (offerData: Omit<BuyerOffer, 'id' | 'createdAt'>) => {
    const newOffer: BuyerOffer = {
      ...offerData,
      id: `off-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setBuyerOffers((prev) => [newOffer, ...prev]);
    const ntf: Notification = {
      id: `ntf-${Date.now()}`,
      userId: 'usr-farmer-1',
      role: 'farmer',
      title: 'New Offer Received! 🎯',
      message: `${newOffer.buyerName} offered ₹${newOffer.offeredPrice}/q for your ${newOffer.cropName}.`,
      type: 'offer',
      date: 'Just now',
      read: false,
      link: '/farmer/offers'
    };
    setNotifications((prev) => [ntf, ...prev]);
  };

  const updateOfferStatus = (offerId: string, status: BuyerOffer['status']) => {
    setBuyerOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, status } : o)));
  };

  const sendChatMessage = (buyerId: string, message: Omit<ChatMessage, 'id'>) => {
    const newMsg: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}`
    };
    setChatMessages((prev) => ({
      ...prev,
      [buyerId]: [...(prev[buyerId] || []), newMsg]
    }));
  };

  const createTransactionFromOffer = (
    offer: BuyerOffer,
    farmerPhone: string,
    farmerLocation: string,
    buyerPhone: string,
    buyerLocation: string
  ): Transaction => {
    const targetCrop = crops.find((c) => c.id === offer.cropListingId);
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      receiptNo: `AP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      cropListingId: offer.cropListingId,
      cropName: offer.cropName,
      farmerId: targetCrop?.farmerId || 'usr-farmer-1',
      farmerName: targetCrop?.farmerName || 'Ramesh Patel',
      farmerPhone,
      farmerLocation,
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      buyerPhone,
      buyerLocation,
      quantity: offer.quantity,
      unit: offer.unit,
      agreedPrice: offer.offeredPrice,
      totalAmount: offer.totalAmount,
      purchaseDate: new Date().toISOString().split('T')[0],
      deliveryStatus: 'Deal Confirmed',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTransactions((prev) => [tx, ...prev]);
    updateCrop(offer.cropListingId, { status: 'Sold' });
    updateOfferStatus(offer.id, 'Accepted');

    return tx;
  };

  const bookTransport = (bookingData: Omit<TransportBooking, 'id' | 'bookingDate'>): TransportBooking => {
    const booking: TransportBooking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setTransportBookings((prev) => [booking, ...prev]);

    if (booking.transactionId) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === booking.transactionId
            ? { ...t, deliveryStatus: 'Transportation Arranged', transportBookingId: booking.id }
            : t
        )
      );
    }
    return booking;
  };

  const updateTransportStatus = (bookingId: string, status: TransportBooking['status']) => {
    setTransportBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const updatedTimeline = b.timeline.map((step) => {
          if (step.status.toLowerCase() === status.toLowerCase()) {
            return { ...step, done: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
          }
          return step;
        });

        return { ...b, status, timeline: updatedTimeline };
      })
    );

    const targetBooking = transportBookings.find((b) => b.id === bookingId);
    if (targetBooking?.transactionId) {
      let txStatus: Transaction['deliveryStatus'] = 'In Transit';
      if (status === 'Pickup Completed') txStatus = 'Pickup';
      if (status === 'In Transit') txStatus = 'In Transit';
      if (status === 'Delivered') txStatus = 'Delivered';

      setTransactions((prev) =>
        prev.map((t) => (t.id === targetBooking.transactionId ? { ...t, deliveryStatus: txStatus } : t))
      );
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status: 'Dismissed' } : a)));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const toggleUserVerification = (userId: string) => {
    setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, verified: !u.verified } : u)));
  };

  return (
    <DataContext.Provider
      value={{
        crops,
        buyerRequirements,
        buyerOffers,
        chatMessages,
        transactions,
        transportBookings,
        alerts,
        notifications,
        usersList,
        addCrop,
        updateCrop,
        deleteCrop,
        addRequirement,
        sendOffer,
        updateOfferStatus,
        sendChatMessage,
        createTransactionFromOffer,
        bookTransport,
        updateTransportStatus,
        dismissAlert,
        markNotificationRead,
        toggleUserVerification
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
