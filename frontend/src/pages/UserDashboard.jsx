import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useParkingLots } from "../hooks/useParkingLots";
import { mockApi } from "../services/api";

import LoadingSpinner from "../components/LoadingSpinner";
import LotCard from "../components/LotCard";
import MapPicker from "../components/MapPicker";
import ParkingMap from "../components/ParkingMap";

import {
  FaSearch,
  FaClock,
  FaMapMarkerAlt,
  FaCar,
  FaFilter,
  FaMap,
  FaList,
  FaBell,
  FaLocationArrow,
} from "react-icons/fa";

export default function UserDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { parkingLots, loading, refetch } = useParkingLots();

  const [searchTerm, setSearchTerm] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [activeTab, setActiveTab] = useState("explore");

  const [userLocation, setUserLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [filters, setFilters] = useState({
    covered: false,
    open: false,
    ev: false,
    accessible: false,
  });

  const [locationQuery, setLocationQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [mapPickerKey, setMapPickerKey] = useState(0);
  const [activeMapLot, setActiveMapLot] = useState(null);

  const filterLabels = {
    covered: "Covered",
    open: "Open-Air",
    ev: "EV Charging",
    accessible: "Handicap Accessible",
  };

  const notificationStyles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    danger: "bg-red-50 border-red-200 text-red-800",
  };

  /** Get current location */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => console.log("Location permission denied")
    );
  }, []);

  /** Auth check */
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (user?.role === "manager" || user?.role === "admin") {
      navigate("/manager-dashboard", { replace: true });
      return;
    }

    fetchReservations();
  }, [authLoading, isAuthenticated, user, navigate]);

  /** Refresh reservations + slots on window focus */
  useEffect(() => {
    const fn = () => {
      fetchReservations();
      refetch();
    };
    window.addEventListener("focus", fn);
    return () => window.removeEventListener("focus", fn);
  }, [refetch]);

  /** Fetch reservations */
  const fetchReservations = async () => {
    try {
      setLoadingReservations(true);
      setReservations(await mockApi.getMyReservations());
    } catch (err) {
      console.error("Reservation fetch failed:", err);
    } finally {
      setLoadingReservations(false);
    }
  };

  /** Calculate distance */
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lat2) return null;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
  };

  const getRemainingTime = (target) => {
    const diff = new Date(target) - new Date();
    if (diff <= 0) return "Expired";
    return `${Math.floor(diff / 60000)}m ${Math.floor((diff % 60000) / 1000)}s`;
  };

  /** FILTERED LIST */
  const filteredLotsMemo = useMemo(() => {
    const activeFilters = Object.keys(filters).filter((f) => filters[f]);

    return parkingLots.filter((lot) => {
      const matchesSearch =
        lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.address.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (!activeFilters.length) return true;
      if (!lot.features) return false;

      return activeFilters.every((key) => lot.features.includes(key));
    });
  }, [parkingLots, searchTerm, filters]);

  /** SORTED BY NEARBY */
  const sortedLots = useMemo(() => {
    if (!userLocation) return filteredLotsMemo;
    return [...filteredLotsMemo].sort((a, b) => {
      const A = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const B = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return (A || 999) - (B || 999);
    });
  }, [filteredLotsMemo, userLocation]);

  /** DIRECTIONS */
  const getDirectionsUrl = (lat, lng) =>
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const handleDirections = (lot) =>
    window.open(getDirectionsUrl(lot.lat, lot.lng), "_blank");

  /** NOTIFICATION GENERATION */
  const updateNotifications = useCallback(async () => {
    if (!reservations.length) {
      setNotifications([]);
      return;
    }

    const now = Date.now();
    const messages = [];

    for (const r of reservations) {
      const timeLeft = new Date(r.reservedUntil).getTime() - now;

      if (timeLeft <= 0) {
        messages.push({
          id: r.id + "-expired",
          type: "danger",
          text: `Reservation for Slot ${r.slotNumber} has expired.`,
        });
      } else if (timeLeft <= 10 * 60 * 1000) {
        messages.push({
          id: r.id + "-expiring",
          type: "warning",
          text: `Slot ${r.slotNumber} expires in ${Math.ceil(
            timeLeft / 60000
          )} min.`,
        });
      }

      try {
        const status = await mockApi.getSlotStatus(r.lotId, r.slotId);
        if (status.status !== "reserved") {
          messages.push({
            id: r.id + "-lost",
            type: "danger",
            text: `Slot ${r.slotNumber} at ${r.lotName} is no longer reserved.`,
          });
        }
      } catch {}
    }

    setNotifications(messages);
  }, [reservations]);

  /** AUTO UPDATE NOTIFICATIONS EVERY 30 SEC */
  useEffect(() => {
    updateNotifications();
    const i = setInterval(updateNotifications, 30000);
    return () => clearInterval(i);
  }, [updateNotifications]);

  /** CANCEL RESERVATION */
  const handleCancelReservation = async (reservation) => {
    if (!window.confirm(`Cancel reservation for Slot ${reservation.slotNumber}?`)) return;

    await mockApi.releaseSlot(reservation.lotId, reservation.slotId);

    fetchReservations();
    refetch();
  };

  /** LOCATE ME */
  const handleLocateMe = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setLocationError("Location permission denied")
    );
  };

  /** LOADING */
  if (authLoading || loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-600 mt-1 text-lg">
            Find & reserve your parking easily
          </p>
        </div>

        {/* NOTIFICATIONS */}
        {notifications.length > 0 && (
          <div className="mb-6 space-y-3">
            {notifications.map((note) => (
              <div
                key={note.id}
                className={`border rounded-xl p-4 flex items-start gap-3 shadow ${notificationStyles[note.type]}`}
              >
                <FaBell className="mt-1" />
                <p className="font-medium">{note.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Available Lots</p>
            <p className="text-3xl font-bold">{parkingLots.length}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Total Slots</p>
            <p className="text-3xl font-bold">
              {parkingLots.reduce((a, b) => a + b.totalSlots, 0)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-500">
            <p className="text-sm text-gray-600">My Reservations</p>
            <p className="text-3xl font-bold">{reservations.length}</p>
          </div>
        </div>

        {/* TABS */}
        <div className="inline-flex bg-white p-1 rounded-xl shadow mb-6">
          <button
            onClick={() => setActiveTab("explore")}
            className={`px-6 py-3 rounded-lg ${
              activeTab === "explore"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Explore
          </button>

          <button
            onClick={() => setActiveTab("my-reservations")}
            className={`px-6 py-3 rounded-lg ${
              activeTab === "my-reservations"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            My Reservations
          </button>
        </div>

        {/* EXPLORE TAB */}
        {activeTab === "explore" && (
          <div className="space-y-6">
            {/* Search + View */}
            <div className="bg-white p-6 rounded-2xl shadow space-y-4">
              <div className="relative max-w-2xl mx-auto">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search for parking…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border rounded-xl"
                />
              </div>

              <div className="flex gap-4 border-t pt-4 items-center">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <FaList /> View:
                </span>

                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-lg ${
                    viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-100"
                  }`}
                >
                  List
                </button>

                <button
                  onClick={() => setViewMode("map")}
                  className={`px-4 py-2 rounded-lg ${
                    viewMode === "map" ? "bg-blue-600 text-white" : "bg-gray-100"
                  }`}
                >
                  Map
                </button>
              </div>
            </div>

            {/* MAP MODE */}
            {viewMode === "map" ? (
              <div className="bg-white p-4 rounded-2xl shadow">
                <ParkingMap
                  lots={sortedLots}
                  userLocation={userLocation}
                  onSelectLot={setActiveMapLot}
                />

                {activeMapLot && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-xl flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{activeMapLot.name}</h3>
                      <p className="text-gray-600">{activeMapLot.address}</p>
                    </div>

                    <button
                      onClick={() => navigate(`/lot/${activeMapLot.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Book Now
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* LIST MODE */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedLots.map((lot) => (
                  <LotCard
                    key={lot.id}
                    lot={lot}
                    onDirections={handleDirections}
                    onBook={() => navigate(`/lot/${lot.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* RESERVATIONS TAB */}
        {activeTab === "my-reservations" && (
          <div>
            {loadingReservations ? (
              <LoadingSpinner />
            ) : reservations.length === 0 ? (
              <div className="text-center bg-white p-10 rounded-xl shadow">
                <FaClock className="text-6xl text-gray-300 mx-auto mb-4" />
                <p>No active reservations</p>
              </div>
            ) : (
              reservations.map((r) => (
                <div
                  key={r.id}
                  className="bg-white p-6 rounded-xl shadow mb-4"
                >
                  <h3 className="text-xl font-bold">{r.lotName}</h3>
                  <p className="text-gray-600">{r.lotAddress}</p>

                  <p className="mt-2 text-blue-600">
                    Remaining: {getRemainingTime(r.reservedUntil)}
                  </p>

                  <button
                    onClick={() => navigate(`/lot/${r.lotId}`)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    View Lot
                  </button>

                  <button
                    onClick={() => handleCancelReservation(r)}
                    className="mt-4 ml-3 px-4 py-2 bg-red-100 text-red-600 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* MAP MODAL */}
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Pick Location</h2>

            <MapPicker
              key={mapPickerKey}
              onSelect={(pos) => {
                setUserLocation(pos);
                setShowMap(false);
              }}
            />

            <div className="text-right mt-4">
              <button
                onClick={() => setShowMap(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
