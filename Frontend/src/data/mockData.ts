import type {
  User,
  CropListing,
  BuyerRequirement,
  PriceIntelligence,
  AbnormalPriceAlert,
  BuyerOffer,
  ChatMessage,
  Transaction,
  TransporterProfile,
  TransportBooking,
  DemandForecast,
  Notification
} from '../types';

export const mockUsers: User[] = [
  {
    id: 'usr-farmer-1',
    name: 'Ramesh Patel',
    email: 'farmer@demo.com',
    phone: '+91 98765 43210',
    role: 'farmer',
    verified: true,
    location: 'Rajkot, Gujarat',
    district: 'Rajkot',
    state: 'Gujarat',
    joinedDate: '2025-02-10',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200',
    farmDetails: {
      farmSizeAcres: 12.5,
      primaryCrops: ['Tomato', 'Cotton', 'Groundnut'],
      pickupAddress: 'Survey No. 42, Gondal Road, Rajkot, Gujarat - 360004'
    }
  },
  {
    id: 'usr-buyer-1',
    name: 'Rajesh Shah',
    email: 'buyer@demo.com',
    phone: '+91 98250 12345',
    role: 'buyer',
    verified: true,
    location: 'Ahmedabad, Gujarat',
    district: 'Ahmedabad',
    state: 'Gujarat',
    joinedDate: '2025-01-15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    businessDetails: {
      businessName: 'Shree Fresh Foods Pvt Ltd',
      gstNumber: '24AAACS1234F1Z5',
      businessType: 'Agricultural Wholesaler & Processing'
    }
  },
  {
    id: 'usr-transporter-1',
    name: 'Vikram Singh',
    email: 'transporter@demo.com',
    phone: '+91 97123 98765',
    role: 'transporter',
    verified: true,
    location: 'Morbi, Gujarat',
    district: 'Morbi',
    state: 'Gujarat',
    joinedDate: '2025-03-01',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    vehicleDetails: {
      companyName: 'Raj Transport Services',
      vehicleType: 'Tata 407',
      vehicleNumber: 'GJ-03-BW-7890',
      capacityKg: 2500
    }
  },
  {
    id: 'usr-admin-1',
    name: 'SIH Platform Admin',
    email: 'admin@demo.com',
    phone: '+91 90000 11111',
    role: 'admin',
    verified: true,
    location: 'Gandhinagar, Gujarat',
    district: 'Gandhinagar',
    state: 'Gujarat',
    joinedDate: '2025-01-01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  }
];

export const mockCrops: CropListing[] = [
  {
    id: 'crop-101',
    farmerId: 'usr-farmer-1',
    farmerName: 'Ramesh Patel',
    cropName: 'Tomato',
    variety: 'Hybrid Hybrid-314',
    quantity: 500,
    unit: 'kg',
    grade: 'Grade A',
    location: 'Rajkot, Gujarat',
    district: 'Rajkot',
    state: 'Gujarat',
    pickupLocation: 'Farm Gate, Farm #42, Gondal Highway, Rajkot',
    expectedPrice: 2500,
    currentMarketPrice: 2450,
    aiFairPriceMin: 2400,
    aiFairPriceMax: 2600,
    status: 'Active',
    harvestDate: '2026-09-08',
    expectedSellingDate: '2026-09-12',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=500',
    distanceKm: 28,
    createdAt: '2026-09-09'
  },
  {
    id: 'crop-102',
    farmerId: 'usr-farmer-1',
    farmerName: 'Ramesh Patel',
    cropName: 'Wheat',
    variety: 'Sharbati Gold',
    quantity: 2000,
    unit: 'kg',
    grade: 'Premium',
    location: 'Gondal, Gujarat',
    district: 'Rajkot',
    state: 'Gujarat',
    pickupLocation: 'Gondal Sub-APMC Yard, Shed 4',
    expectedPrice: 2800,
    currentMarketPrice: 2750,
    aiFairPriceMin: 2700,
    aiFairPriceMax: 2900,
    status: 'Active',
    harvestDate: '2026-09-01',
    expectedSellingDate: '2026-09-15',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=500',
    distanceKm: 42,
    createdAt: '2026-09-07'
  },
  {
    id: 'crop-103',
    farmerId: 'usr-farmer-2',
    farmerName: 'Jayeshbhai Patel',
    cropName: 'Onion',
    variety: 'Mahuva Red',
    quantity: 1200,
    unit: 'kg',
    grade: 'Grade A',
    location: 'Bhavnagar, Gujarat',
    district: 'Bhavnagar',
    state: 'Gujarat',
    pickupLocation: 'Mahuva APMC Gate 2',
    expectedPrice: 1950,
    currentMarketPrice: 1900,
    aiFairPriceMin: 1850,
    aiFairPriceMax: 2050,
    status: 'Under Negotiation',
    harvestDate: '2026-09-05',
    expectedSellingDate: '2026-09-11',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=600',
    distanceKm: 65,
    createdAt: '2026-09-08'
  },
  {
    id: 'crop-104',
    farmerId: 'usr-farmer-3',
    farmerName: 'Bhavesh Chaudhari',
    cropName: 'Potato',
    variety: 'Deesa Jyoti',
    quantity: 3000,
    unit: 'kg',
    grade: 'Grade A',
    location: 'Deesa, Banaskantha',
    district: 'Banaskantha',
    state: 'Gujarat',
    pickupLocation: 'Cold Storage Unit 3, Deesa',
    expectedPrice: 1450,
    currentMarketPrice: 1400,
    aiFairPriceMin: 1380,
    aiFairPriceMax: 1520,
    status: 'Active',
    harvestDate: '2026-09-02',
    expectedSellingDate: '2026-09-14',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=500',
    distanceKm: 110,
    createdAt: '2026-09-06'
  },
  {
    id: 'crop-105',
    farmerId: 'usr-farmer-1',
    farmerName: 'Ramesh Patel',
    cropName: 'Cotton',
    variety: 'BT Cotton Long Staple',
    quantity: 1500,
    unit: 'kg',
    grade: 'Grade A',
    location: 'Jetpur, Gujarat',
    district: 'Rajkot',
    state: 'Gujarat',
    pickupLocation: 'Jetpur Ginning Mill Road, Farm 18',
    expectedPrice: 7200,
    currentMarketPrice: 7100,
    aiFairPriceMin: 7000,
    aiFairPriceMax: 7400,
    status: 'Active',
    harvestDate: '2026-09-04',
    expectedSellingDate: '2026-09-18',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=500',
    distanceKm: 34,
    createdAt: '2026-09-09'
  }
];

export const mockPriceIntelligence: Record<string, PriceIntelligence> = {
  Tomato: {
    cropName: 'Tomato',
    market: 'Rajkot APMC',
    currentPrice: 2450,
    unit: 'quintal',
    aiFairPriceMin: 2400,
    aiFairPriceMax: 2600,
    predicted7DayPrice: 2680,
    buyerAvgOffer: 2520,
    confidencePercent: 87,
    priceTrend: 'up',
    changePercent: 9.3,
    recommendation: 'WAIT',
    recommendationReason: 'Based on recent APMC market trends, strong retail demand in urban centers, and lower regional arrivals, tomato prices are predicted to rise by ~9.3% over the next 7 days.',
    demandSignal: 'High Demand (+14% search volume)',
    supplySignal: 'Tight Supply (-8% APMC arrivals)',
    historicalData: [
      { date: 'Sep 4', price: 2200 },
      { date: 'Sep 5', price: 2250 },
      { date: 'Sep 6', price: 2320 },
      { date: 'Sep 7', price: 2380 },
      { date: 'Sep 8', price: 2420 },
      { date: 'Sep 9', price: 2450 },
      { date: 'Today', price: 2450, predicted: 2450 },
      { date: 'Sep 11', price: 2450, predicted: 2510 },
      { date: 'Sep 13', price: 2450, predicted: 2590 },
      { date: 'Sep 15', price: 2450, predicted: 2680 }
    ]
  },
  Wheat: {
    cropName: 'Wheat',
    market: 'Gondal APMC',
    currentPrice: 2750,
    unit: 'quintal',
    aiFairPriceMin: 2700,
    aiFairPriceMax: 2900,
    predicted7DayPrice: 2790,
    buyerAvgOffer: 2760,
    confidencePercent: 91,
    priceTrend: 'stable',
    changePercent: 1.4,
    recommendation: 'STABLE',
    recommendationReason: 'Wheat supply remains steady across Saurashtra markets. Institutional buying is strong, keeping prices firmly within fair valuation.',
    demandSignal: 'Steady Demand (+3%)',
    supplySignal: 'Normal Supply',
    historicalData: [
      { date: 'Sep 4', price: 2700 },
      { date: 'Sep 5', price: 2710 },
      { date: 'Sep 6', price: 2730 },
      { date: 'Sep 7', price: 2740 },
      { date: 'Sep 8', price: 2750 },
      { date: 'Sep 9', price: 2750 },
      { date: 'Today', price: 2750, predicted: 2750 },
      { date: 'Sep 11', price: 2750, predicted: 2765 },
      { date: 'Sep 13', price: 2750, predicted: 2780 },
      { date: 'Sep 15', price: 2750, predicted: 2790 }
    ]
  },
  Onion: {
    cropName: 'Onion',
    market: 'Mahuva APMC',
    currentPrice: 1900,
    unit: 'quintal',
    aiFairPriceMin: 1850,
    aiFairPriceMax: 2050,
    predicted7DayPrice: 2020,
    buyerAvgOffer: 1940,
    confidencePercent: 84,
    priceTrend: 'up',
    changePercent: 6.3,
    recommendation: 'WAIT',
    recommendationReason: 'Export quota relief and reduced rainfall in key onion growing belts indicate a price surge expected within 5-7 days.',
    demandSignal: 'Export Surge (+18%)',
    supplySignal: 'Moderate Supply',
    historicalData: [
      { date: 'Sep 4', price: 1780 },
      { date: 'Sep 5', price: 1810 },
      { date: 'Sep 6', price: 1840 },
      { date: 'Sep 7', price: 1870 },
      { date: 'Sep 8', price: 1890 },
      { date: 'Sep 9', price: 1900 },
      { date: 'Today', price: 1900, predicted: 1900 },
      { date: 'Sep 11', price: 1900, predicted: 1945 },
      { date: 'Sep 13', price: 1900, predicted: 1980 },
      { date: 'Sep 15', price: 1900, predicted: 2020 }
    ]
  },
  Potato: {
    cropName: 'Potato',
    market: 'Deesa APMC',
    currentPrice: 1400,
    unit: 'quintal',
    aiFairPriceMin: 1380,
    aiFairPriceMax: 1520,
    predicted7DayPrice: 1370,
    buyerAvgOffer: 1390,
    confidencePercent: 89,
    priceTrend: 'down',
    changePercent: -2.1,
    recommendation: 'SELL_NOW',
    recommendationReason: 'Cold storage stock releases in North Gujarat are increasing daily supply, which will likely exert mild downward pressure on prices.',
    demandSignal: 'Moderate Demand',
    supplySignal: 'High Storage Supply (+12%)',
    historicalData: [
      { date: 'Sep 4', price: 1450 },
      { date: 'Sep 5', price: 1440 },
      { date: 'Sep 6', price: 1430 },
      { date: 'Sep 7', price: 1420 },
      { date: 'Sep 8', price: 1410 },
      { date: 'Sep 9', price: 1400 },
      { date: 'Today', price: 1400, predicted: 1400 },
      { date: 'Sep 11', price: 1400, predicted: 1390 },
      { date: 'Sep 13', price: 1400, predicted: 1380 },
      { date: 'Sep 15', price: 1400, predicted: 1370 }
    ]
  }
};

export const mockBuyerRequirements: BuyerRequirement[] = [
  {
    id: 'req-201',
    buyerId: 'usr-buyer-1',
    buyerName: 'Shree Fresh Foods Pvt Ltd',
    verified: true,
    cropName: 'Tomato',
    quantity: 500,
    unit: 'kg',
    grade: 'Grade A',
    preferredLocation: 'Rajkot / Morbi / Ahmedabad',
    offeredPrice: 2580,
    purchaseDate: '2026-09-12',
    deliveryRequirement: 'Direct farm pickup required',
    status: 'Active',
    createdAt: '2026-09-09'
  },
  {
    id: 'req-202',
    buyerId: 'usr-buyer-2',
    buyerName: 'Gujarat Agro Processing Ltd',
    verified: true,
    cropName: 'Tomato',
    quantity: 1000,
    unit: 'kg',
    grade: 'Grade A',
    preferredLocation: 'Saurashtra Region',
    offeredPrice: 2510,
    purchaseDate: '2026-09-14',
    deliveryRequirement: 'Factory gate delivery in Ahmedabad',
    status: 'Active',
    createdAt: '2026-09-08'
  },
  {
    id: 'req-203',
    buyerId: 'usr-buyer-3',
    buyerName: 'Kisan Organics Wholesalers',
    verified: false,
    cropName: 'Tomato',
    quantity: 400,
    unit: 'kg',
    grade: 'Grade B',
    preferredLocation: 'Rajkot',
    offeredPrice: 1850,
    purchaseDate: '2026-09-11',
    deliveryRequirement: 'Self pickup',
    status: 'Active',
    createdAt: '2026-09-09'
  }
];

export const mockBuyerOffers: BuyerOffer[] = [
  {
    id: 'off-301',
    cropListingId: 'crop-101',
    cropName: 'Tomato',
    buyerId: 'usr-buyer-1',
    buyerName: 'Shree Fresh Foods Pvt Ltd',
    buyerVerified: true,
    offeredPrice: 2580,
    quantity: 500,
    unit: 'kg',
    totalAmount: 12900,
    deliveryDate: '2026-09-12',
    compatibilityScore: 94,
    distanceKm: 28,
    purchaseDate: '2026-09-12',
    gradeRequirement: 'Grade A',
    status: 'Pending',
    createdAt: '2026-09-09 14:30'
  },
  {
    id: 'off-302',
    cropListingId: 'crop-101',
    cropName: 'Tomato',
    buyerId: 'usr-buyer-2',
    buyerName: 'Gujarat Agro Processing Ltd',
    buyerVerified: true,
    offeredPrice: 2510,
    quantity: 500,
    unit: 'kg',
    totalAmount: 12550,
    deliveryDate: '2026-09-14',
    compatibilityScore: 88,
    distanceKm: 45,
    purchaseDate: '2026-09-14',
    gradeRequirement: 'Grade A',
    status: 'Pending',
    createdAt: '2026-09-09 16:15'
  },
  {
    id: 'off-303',
    cropListingId: 'crop-101',
    cropName: 'Tomato',
    buyerId: 'usr-buyer-3',
    buyerName: 'Kisan Organics Wholesalers',
    buyerVerified: false,
    offeredPrice: 1850,
    quantity: 500,
    unit: 'kg',
    totalAmount: 9250,
    deliveryDate: '2026-09-11',
    compatibilityScore: 52,
    distanceKm: 12,
    purchaseDate: '2026-09-11',
    gradeRequirement: 'Grade B',
    status: 'Pending',
    createdAt: '2026-09-09 18:00'
  }
];

export const mockChatMessages: Record<string, ChatMessage[]> = {
  'usr-buyer-1': [
    {
      id: 'msg-1',
      negotiationId: 'neg-101',
      senderId: 'usr-farmer-1',
      senderName: 'Ramesh Patel',
      senderRole: 'farmer',
      text: 'Namaste! I have 500 kg Grade A Hybrid Tomatoes ready for harvest near Rajkot.',
      timestamp: '14:30 PM'
    },
    {
      id: 'msg-2',
      negotiationId: 'neg-101',
      senderId: 'usr-buyer-1',
      senderName: 'Rajesh Shah (Shree Fresh Foods)',
      senderRole: 'buyer',
      text: 'Hello Rameshji. We are interested. Can you offer ₹2,500 per quintal for the full batch?',
      timestamp: '14:32 PM'
    },
    {
      id: 'msg-3',
      negotiationId: 'neg-101',
      senderId: 'usr-farmer-1',
      senderName: 'Ramesh Patel',
      senderRole: 'farmer',
      text: 'AI Fair Price predicts ₹2,600+ in 5 days. How about ₹2,550 per quintal with pickup on 12th Sept?',
      timestamp: '14:35 PM',
      offerData: {
        price: 2550,
        quantity: 500,
        unit: 'kg',
        deliveryDate: '2026-09-12',
        status: 'Countered'
      }
    },
    {
      id: 'msg-4',
      negotiationId: 'neg-101',
      senderId: 'usr-buyer-1',
      senderName: 'Rajesh Shah (Shree Fresh Foods)',
      senderRole: 'buyer',
      text: '₹2,550 looks fair based on your quality grade. I am updating my official offer card to ₹2,580 per quintal to lock the deal!',
      timestamp: '14:38 PM',
      offerData: {
        price: 2580,
        quantity: 500,
        unit: 'kg',
        deliveryDate: '2026-09-12',
        status: 'Pending'
      }
    }
  ]
};

export const mockAbnormalAlerts: AbnormalPriceAlert[] = [
  {
    id: 'alt-1',
    cropName: 'Tomato',
    buyerId: 'usr-buyer-3',
    buyerName: 'Kisan Organics Wholesalers',
    offeredPrice: 1850,
    fairPriceMin: 2400,
    fairPriceMax: 2600,
    differencePercent: -23.0,
    severity: 'High',
    status: 'Pending',
    date: '2026-09-09'
  },
  {
    id: 'alt-2',
    cropName: 'Cotton',
    buyerId: 'usr-buyer-8',
    buyerName: 'Saurashtra Textiles',
    offeredPrice: 5800,
    fairPriceMin: 7000,
    fairPriceMax: 7400,
    differencePercent: -18.3,
    severity: 'Medium',
    status: 'Pending',
    date: '2026-09-08'
  }
];

export const mockTransporters: TransporterProfile[] = [
  {
    id: 'trans-1',
    companyName: 'Raj Transport Services',
    driverName: 'Vikram Singh',
    vehicleType: 'Tata 407',
    vehicleNumber: 'GJ-03-BW-7890',
    capacityKg: 2500,
    phone: '+91 97123 98765',
    rating: 4.8,
    totalDeliveries: 142,
    pricePerKm: 18,
    distanceKm: 8,
    available: true
  },
  {
    id: 'trans-2',
    companyName: 'Gujarat Agro Freight',
    driverName: 'Manish Parmar',
    vehicleType: 'Pickup',
    vehicleNumber: 'GJ-01-XX-1234',
    capacityKg: 1500,
    phone: '+91 98980 54321',
    rating: 4.6,
    totalDeliveries: 98,
    pricePerKm: 15,
    distanceKm: 12,
    available: true
  },
  {
    id: 'trans-3',
    companyName: 'Kisan Express Trucking',
    driverName: 'Suresh Rabari',
    vehicleType: 'Large Truck',
    vehicleNumber: 'GJ-05-AB-9988',
    capacityKg: 8000,
    phone: '+91 99090 11223',
    rating: 4.9,
    totalDeliveries: 310,
    pricePerKm: 32,
    distanceKm: 22,
    available: true
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-8001',
    receiptNo: 'AP-2026-09-8001',
    cropListingId: 'crop-101',
    cropName: 'Tomato',
    farmerId: 'usr-farmer-1',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 98765 43210',
    farmerLocation: 'Rajkot, Gujarat',
    buyerId: 'usr-buyer-1',
    buyerName: 'Shree Fresh Foods Pvt Ltd',
    buyerPhone: '+91 98250 12345',
    buyerLocation: 'Ahmedabad, Gujarat',
    quantity: 500,
    unit: 'kg',
    agreedPrice: 2580,
    totalAmount: 12900,
    purchaseDate: '2026-09-10',
    deliveryStatus: 'In Transit',
    transportBookingId: 'bk-901',
    createdAt: '2026-09-10'
  }
];

export const mockTransportBookings: TransportBooking[] = [
  {
    id: 'bk-901',
    transactionId: 'tx-8001',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 98765 43210',
    pickupLocation: 'Farm Gate #42, Gondal Highway, Rajkot',
    buyerName: 'Shree Fresh Foods Pvt Ltd',
    buyerPhone: '+91 98250 12345',
    deliveryLocation: 'Warehouse 7, Naroda GIDC, Ahmedabad',
    cropName: 'Tomato',
    quantityKg: 500,
    distanceKm: 215,
    estimatedCost: 3870,
    transporterId: 'trans-1',
    transporterName: 'Raj Transport Services',
    driverName: 'Vikram Singh',
    driverPhone: '+91 97123 98765',
    vehicleType: 'Tata 407 (GJ-03-BW-7890)',
    vehicleNumber: 'GJ-03-BW-7890',
    status: 'In Transit',
    eta: '3 hrs 20 mins',
    bookingDate: '2026-09-10 09:00',
    timeline: [
      { status: 'Booking Confirmed', timestamp: '09:00 AM', done: true },
      { status: 'Pickup Completed', timestamp: '11:30 AM', done: true },
      { status: 'In Transit', timestamp: '12:15 PM', done: true },
      { status: 'Delivered', timestamp: 'Estimated 03:35 PM', done: false }
    ]
  }
];

export const mockDemandForecasts: Record<string, DemandForecast> = {
  Tomato: {
    cropName: 'Tomato',
    location: 'Rajkot / Saurashtra',
    currentDemandIndex: 82,
    forecast7DaysPercent: 14.0,
    forecast30DaysPercent: 22.5,
    trend: 'Increasing',
    bestSellingWindow: 'Next 5 to 9 Days (Highest Price Peak)',
    supplyTrend: 'Decreasing regional supply due to season transition',
    expectedPriceImpact: '+₹180 to ₹230 per quintal surge expected',
    chartData: [
      { day: 'Day 1', historical: 100, forecast: 100 },
      { day: 'Day 3', historical: 105, forecast: 108 },
      { day: 'Day 5', historical: 102, forecast: 114 },
      { day: 'Day 7', historical: 110, forecast: 122 },
      { day: 'Day 10', historical: 108, forecast: 128 },
      { day: 'Day 14', historical: 112, forecast: 135 }
    ]
  },
  Wheat: {
    cropName: 'Wheat',
    location: 'Gondal / Central Gujarat',
    currentDemandIndex: 68,
    forecast7DaysPercent: 3.5,
    forecast30DaysPercent: 8.0,
    trend: 'Stable',
    bestSellingWindow: 'Immediate selling recommended for liquidity',
    supplyTrend: 'Steady warehouse stocks across district APMCs',
    expectedPriceImpact: 'Minor positive impact (+₹30/q)',
    chartData: [
      { day: 'Day 1', historical: 100, forecast: 100 },
      { day: 'Day 3', historical: 101, forecast: 102 },
      { day: 'Day 5', historical: 102, forecast: 103 },
      { day: 'Day 7', historical: 103, forecast: 104 },
      { day: 'Day 10', historical: 104, forecast: 106 },
      { day: 'Day 14', historical: 105, forecast: 108 }
    ]
  }
};

export const mockNotifications: Notification[] = [
  {
    id: 'ntf-1',
    userId: 'usr-farmer-1',
    role: 'farmer',
    title: 'New Buyer Offer Received! 🔔',
    message: 'Shree Fresh Foods offered ₹2,580/q for 500 kg Tomato listing.',
    type: 'offer',
    date: '10 mins ago',
    read: false,
    link: '/farmer/offers'
  },
  {
    id: 'ntf-2',
    userId: 'usr-farmer-1',
    role: 'farmer',
    title: 'AI Price Alert 📈',
    message: 'Tomato predicted price increased to ₹2,680/q for next week.',
    type: 'price',
    date: '1 hour ago',
    read: false,
    link: '/farmer/ai-price-intelligence'
  },
  {
    id: 'ntf-3',
    userId: 'usr-farmer-1',
    role: 'farmer',
    title: 'Shipment Picked Up 🚚',
    message: 'Transporter Vikram Singh (Tata 407) has completed farm pickup for Booking #bk-901.',
    type: 'transport',
    date: '2 hours ago',
    read: true,
    link: '/farmer/transportation'
  }
];
