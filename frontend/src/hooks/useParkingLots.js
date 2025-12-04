import { useState, useEffect } from 'react';
import { api, mockApi } from '../services/api';

export function useParkingLots() {
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchParkingLots();
  }, []);

  const fetchParkingLots = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use mockApi for now - replace with api when backend is ready
      const data = await mockApi.getParkingLots();
      setParkingLots(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { parkingLots, loading, error, refetch: fetchParkingLots };
}

export function useParkingLot(id) {
  const [parkingLot, setParkingLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchParkingLot();
  }, [id]);

  const fetchParkingLot = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mockApi.getParkingLot(id);
      setParkingLot(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { parkingLot, loading, error, refetch: fetchParkingLot };
}

export function useSlots(lotId) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lotId) return;
    fetchSlots();
  }, [lotId]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mockApi.getSlots(lotId);
      setSlots(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { slots, loading, error, refetch: fetchSlots };
}

