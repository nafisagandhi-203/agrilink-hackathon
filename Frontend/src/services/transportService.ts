import type { TransporterProfile, TransportBooking } from '../types';
import { mockTransporters, mockTransportBookings } from '../data/mockData';
import { apiClient } from './apiClient';

// Known distances map between key agricultural hubs (in KM)
const distanceTable: Record<string, Record<string, number>> = {
  rajkot: {
    ahmedabad: 215,
    surat: 440,
    vadodara: 290,
    junagadh: 102,
    jamnagar: 92,
    bhavnagar: 175,
    gondal: 40,
    mumbai: 700,
    delhi: 1100
  },
  ahmedabad: {
    rajkot: 215,
    surat: 265,
    vadodara: 110,
    gandhinagar: 30,
    anand: 75,
    mehsana: 75,
    mumbai: 530,
    delhi: 940
  },
  surat: {
    ahmedabad: 265,
    rajkot: 440,
    vadodara: 155,
    mumbai: 280
  }
};

export const transportService = {
  async getTransporters(): Promise<TransporterProfile[]> {
    const remote = await apiClient.get<any[]>('/transportproviders');
    if (remote && Array.isArray(remote) && remote.length > 0) {
      return remote.map((tp, idx) => ({
        id: `tp-${tp.transportProviderId || idx + 1}`,
        companyName: tp.name || 'AgroTransit Express',
        driverName: tp.name || 'Ram Singh',
        vehicleType: 'Tata 407',
        vehicleNumber: tp.vehicleNumber || 'GJ-03-BT-4421',
        capacityKg: (tp.vehicleCapacity || 5) * 1000,
        phone: tp.phoneNumber || '+91 98765 43210',
        rating: tp.rating || 4.7,
        totalDeliveries: 120,
        pricePerKm: 18,
        distanceKm: 25,
        available: tp.isAvailable !== false
      }));
    }
    return mockTransporters;
  },

  calculateRoute(origin: string, destination: string) {
    const origClean = (origin || 'Rajkot').toLowerCase().trim();
    const destClean = (destination || 'Ahmedabad').toLowerCase().trim();

    let distanceKm = 0;

    // Search distance table for matches
    for (const [cityA, targetObj] of Object.entries(distanceTable)) {
      if (origClean.includes(cityA)) {
        for (const [cityB, dist] of Object.entries(targetObj)) {
          if (destClean.includes(cityB)) {
            distanceKm = dist;
            break;
          }
        }
      }
      if (distanceKm > 0) break;
    }

    // Fallback heuristic based on string character sum if unknown cities entered
    if (distanceKm === 0) {
      if (origClean === destClean) {
        distanceKm = 15;
      } else {
        const sum = (origClean + destClean).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        distanceKm = (sum % 350) + 45;
      }
    }

    const estimatedHours = Math.round((distanceKm / 55) * 10) / 10;
    const hours = Math.floor(estimatedHours);
    const minutes = Math.round((estimatedHours - hours) * 60);
    const etaText = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;

    const ratePerKm = 18;
    const estimatedCost = Math.round(distanceKm * ratePerKm);

    return {
      origin,
      destination,
      distanceKm,
      estimatedTimeText: etaText,
      estimatedHours,
      estimatedCost
    };
  },

  async estimateWithAi(distanceKm: number, weightTonnes: number, vehicleType: string = '5 Ton Truck') {
    try {
      const res = await apiClient.callAi<any>('/transport-estimate', {
        distance_km: distanceKm,
        weight_tonnes: weightTonnes,
        vehicle_type: vehicleType
      });
      if (res && res.estimated_cost_inr) {
        return {
          estimatedCost: res.estimated_cost_inr,
          estimatedHours: res.estimated_transit_hours || Math.round(distanceKm / 50),
          ratePerKm: res.rate_per_km || 18,
          fuelCostComponent: res.diesel_cost_estimate || Math.round(res.estimated_cost_inr * 0.45)
        };
      }
    } catch (e) {
      console.warn('AI transport estimate fallback:', e);
    }
    return null;
  },

  async getBookings(): Promise<TransportBooking[]> {
    const remote = await apiClient.get<any[]>('/transportbookings');
    if (remote && Array.isArray(remote) && remote.length > 0) {
      const mapped: TransportBooking[] = remote.map((b) => ({
        id: `tb-${b.transportBookingId}`,
        transactionId: `tx-${b.transactionId || 1}`,
        farmerName: 'Ramesh Patel',
        farmerPhone: '+91 98250 12345',
        pickupLocation: b.pickupLocation || 'Rajkot Farm Gate',
        buyerName: 'AgroCorp Direct',
        buyerPhone: '+91 98251 67890',
        deliveryLocation: b.deliveryLocation || 'Ahmedabad Processing Hub',
        cropName: 'Tomato',
        quantityKg: (b.cropQuantity || 1) * 1000,
        distanceKm: b.distanceKm || 50,
        estimatedCost: b.agreedTransportCost || b.estimatedTransportCost || 1500,
        transporterId: `tp-${b.transportProviderId}`,
        transporterName: b.transportProviderName || 'AgroTransit Express',
        driverName: 'Ram Singh',
        driverPhone: '+91 98765 43210',
        vehicleType: b.vehicleType || 'Tata 407',
        vehicleNumber: b.vehicleNumber || 'GJ-03-BT-4421',
        status: 'Booking Confirmed',
        eta: 'Tomorrow 2:00 PM',
        bookingDate: b.requestedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        timeline: [
          { status: 'Booking Confirmed', timestamp: 'Today, 10:00 AM', done: true },
          { status: 'Vehicle Dispatched', timestamp: 'Today, 2:00 PM', done: false },
          { status: 'Crop Loaded', timestamp: 'Pending', done: false },
          { status: 'Delivered', timestamp: 'Pending', done: false }
        ]
      }));
      localStorage.setItem('agripulse_transport', JSON.stringify(mapped));
      return mapped;
    }
    const saved = localStorage.getItem('agripulse_transport');
    return saved ? JSON.parse(saved) : mockTransportBookings;
  },

  async createBooking(booking: Omit<TransportBooking, 'id'>): Promise<TransportBooking> {
    const newBooking: TransportBooking = {
      ...booking,
      id: `tb-${Date.now()}`
    };

    apiClient.post('/transportbookings', {
      transactionId: 1,
      transportProviderId: parseInt(booking.transporterId?.replace('tp-', '') || '1', 10),
      pickupLocation: booking.pickupLocation,
      deliveryLocation: booking.deliveryLocation,
      cropQuantity: booking.quantityKg / 1000,
      distanceKm: booking.distanceKm,
      estimatedTransportCost: booking.estimatedCost,
      agreedTransportCost: booking.estimatedCost
    }).catch((err) => {
      console.info('Backend transport booking sync:', err);
    });

    const bookings = await this.getBookings();
    const updated = [newBooking, ...bookings];
    localStorage.setItem('agripulse_transport', JSON.stringify(updated));
    return newBooking;
  }
};
