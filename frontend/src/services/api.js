const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // Authentication
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  getProfile: async (tokenOverride) => {
    const headers = { 'Content-Type': 'application/json' };
    const token = tokenOverride || localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/profile`, { headers });
    if (!response.ok) throw new Error('Failed to load profile');
    return response.json();
  },

  // Parking Lots
  getParkingLots: async () => {
    const response = await fetch(`${API_BASE_URL}/parking-lots`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch parking lots');
    return response.json();
  },

  getParkingLot: async (id) => {
    const response = await fetch(`${API_BASE_URL}/parking-lots/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch parking lot');
    return response.json();
  },

  // Slots
  getSlots: async (lotId) => {
    const response = await fetch(`${API_BASE_URL}/parking-lots/${lotId}/slots`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch slots');
    return response.json();
  },

  reserveSlot: async (lotId, slotId, vehicleNumber) => {
    const response = await fetch(`${API_BASE_URL}/parking-lots/${lotId}/slots/${slotId}/reserve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ vehicleNumber }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reserve slot');
    }
    return response.json();
  },

  releaseSlot: async (lotId, slotId) => {
    const response = await fetch(`${API_BASE_URL}/parking-lots/${lotId}/slots/${slotId}/release`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to release slot');
    return response.json();
  },

  // User Reservations
  getMyReservations: async () => {
    const response = await fetch(`${API_BASE_URL}/reservations/my`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch reservations');
    return response.json();
  },
};

// Mock data storage (in-memory, persists during session)
const mockStorage = {
  reservations: new Map(),
  slotStates: new Map(), // Store slot states per lot
  userId: null,
  
  // Initialize slot states for a lot
  initLotSlots(lotId, totalSlots) {
    if (!this.slotStates.has(lotId)) {
      const slots = new Map();
      const statuses = ['available', 'occupied', 'reserved', 'maintenance'];
      const probabilities = [0.6, 0.25, 0.1, 0.05]; // More available slots
      
      for (let i = 1; i <= totalSlots; i++) {
        const rand = Math.random();
        let cumulative = 0;
        let status = 'available';
        
        for (let j = 0; j < statuses.length; j++) {
          cumulative += probabilities[j];
          if (rand < cumulative) {
            status = statuses[j];
            break;
          }
        }
        
        slots.set(i, {
          status,
          vehicleNumber: status === 'occupied' ? `ABC-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}` : null,
          reservedUntil: status === 'reserved' ? new Date(Date.now() + 3600000).toISOString() : null,
          reservedBy: status === 'reserved' ? 'user1' : null,
        });
      }
      this.slotStates.set(lotId, slots);
    }
  },
  
  getSlotState(lotId, slotNumber) {
    const slotCounts = {
      '1': 50,
      '2': 100,
      '3': 200,
      '4': 40,
      '5': 80,
    };
    const totalSlots = slotCounts[lotId] || 120;
    this.initLotSlots(lotId, totalSlots);
    const slots = this.slotStates.get(lotId);
    return slots.get(slotNumber) || { status: 'available', vehicleNumber: null, reservedUntil: null, reservedBy: null };
  },
  
  updateSlotState(lotId, slotNumber, updates) {
    const slotCounts = {
      '1': 50,
      '2': 100,
      '3': 200,
      '4': 40,
      '5': 80,
    };
    const totalSlots = slotCounts[lotId] || 120;
    this.initLotSlots(lotId, totalSlots);
    const slots = this.slotStates.get(lotId);
    const current = slots.get(slotNumber) || { status: 'available', vehicleNumber: null, reservedUntil: null, reservedBy: null };
    slots.set(slotNumber, { ...current, ...updates });
  },
};

// Mock data for development (remove when backend is ready)
export const mockApi = {
  getParkingLots: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const baseLots = [
      {
        id: '1',
        name: 'Downtown Parking',
        address: '123 Main St',
        totalSlots: 50,
        pricePerHour: 5,
        lat: 40.7128,
        lng: -74.0060,
        features: ['covered', 'ev', 'accessible'],
      },
      {
        id: '2',
        name: 'Mall Parking',
        address: '456 Market Ave',
        totalSlots: 100,
        pricePerHour: 3,
        lat: 40.7589,
        lng: -73.9851,
        features: ['open', 'ev'],
      },
      {
        id: '3',
        name: 'Airport Parking',
        address: '789 Airport Blvd',
        totalSlots: 200,
        pricePerHour: 8,
        lat: 40.6413,
        lng: -73.7781,
        features: ['covered', 'accessible', 'handicap'],
      },
      {
        id: '4',
        name: 'EV Supercharge Hub',
        address: '12 Green Tech Park',
        totalSlots: 40,
        pricePerHour: 6,
        lat: 40.7306,
        lng: -73.9352,
        features: ['ev', 'covered'],
      },
      {
        id: '5',
        name: 'Open-Air Riverside Lot',
        address: '900 Riverside Dr',
        totalSlots: 80,
        pricePerHour: 2,
        lat: 40.8180,
        lng: -73.9600,
        features: ['open'],
      },
    ];
    
    // Calculate available slots based on actual slot states
    return baseLots.map(lot => {
      mockStorage.initLotSlots(lot.id, lot.totalSlots);
      const slotsMap = mockStorage.slotStates.get(lot.id);
      let availableCount = 0;
      
      for (let i = 1; i <= lot.totalSlots; i++) {
        const state = slotsMap.get(i);
        if (state.status === 'available') {
          availableCount++;
        }
      }
      
      return {
        ...lot,
        availableSlots: availableCount,
      };
    });
  },

  getParkingLot: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lots = await mockApi.getParkingLots();
    const lot = lots.find(l => l.id === id);
    if (!lot) throw new Error('Parking lot not found');
    return lot;
  },

  getSlots: async (lotId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const totalSlots = lotId === '1' ? 50 : lotId === '2' ? 100 : 200;
    mockStorage.initLotSlots(lotId, totalSlots);
    const slotsMap = mockStorage.slotStates.get(lotId);
    const slots = [];
    
    for (let i = 1; i <= totalSlots; i++) {
      const state = slotsMap.get(i);
      slots.push({
        id: `${lotId}-${i}`,
        number: i,
        status: state.status,
        vehicleNumber: state.vehicleNumber,
        reservedUntil: state.reservedUntil,
        reservedBy: state.reservedBy,
      });
    }
    
    return slots;
  },

  reserveSlot: async (lotId, slotId, vehicleNumber) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Extract slot number from slotId (format: "lotId-slotNumber")
    const slotNumber = parseInt(slotId.split('-')[1]);
    const currentState = mockStorage.getSlotState(lotId, slotNumber);
    
    if (currentState.status !== 'available') {
      throw new Error(`Slot ${slotNumber} is not available (status: ${currentState.status})`);
    }
    
    const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : 'user1';
    const reservedUntil = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
    
    // Update slot state
    mockStorage.updateSlotState(lotId, slotNumber, {
      status: 'reserved',
      vehicleNumber,
      reservedUntil,
      reservedBy: userId,
    });
    
    // Create reservation record
    const reservationId = `res-${Date.now()}`;
    mockStorage.reservations.set(reservationId, {
      id: reservationId,
      lotId,
      slotId,
      slotNumber,
      vehicleNumber,
      userId,
      reservedAt: new Date().toISOString(),
      reservedUntil,
    });
    
    return {
      success: true,
      reservation: {
        id: reservationId,
        lotId,
        slotId,
        slotNumber,
        vehicleNumber,
        reservedUntil,
      },
    };
  },

  releaseSlot: async (lotId, slotId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const slotNumber = parseInt(slotId.split('-')[1]);
    const currentState = mockStorage.getSlotState(lotId, slotNumber);
    
    if (currentState.status === 'available') {
      throw new Error('Slot is already available');
    }
    
    // Update slot state to available
    mockStorage.updateSlotState(lotId, slotNumber, {
      status: 'available',
      vehicleNumber: null,
      reservedUntil: null,
      reservedBy: null,
    });
    
    // Remove reservation
    for (const [id, reservation] of mockStorage.reservations.entries()) {
      if (reservation.slotId === slotId) {
        mockStorage.reservations.delete(id);
        break;
      }
    }
    
    return { success: true };
  },

  getMyReservations: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : 'user1';
    const reservations = Array.from(mockStorage.reservations.values())
      .filter(r => r.userId === userId)
      .map(r => {
        const lots = [
          { id: '1', name: 'Downtown Parking', address: '123 Main St' },
          { id: '2', name: 'Mall Parking', address: '456 Market Ave' },
          { id: '3', name: 'Airport Parking', address: '789 Airport Blvd' },
        ];
        const lot = lots.find(l => l.id === r.lotId);
        return {
          ...r,
          lotName: lot?.name || 'Unknown',
          lotAddress: lot?.address || '',
        };
      });
    return reservations;
  },

  getSlotStatus: async (lotId, slotId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const slotNumber = parseInt(slotId.split('-')[1]);
    const state = mockStorage.getSlotState(lotId, slotNumber);
    return state;
  },
};

