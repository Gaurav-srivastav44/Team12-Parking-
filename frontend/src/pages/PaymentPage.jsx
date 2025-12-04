import React, { useState } from "react";
import { FaCreditCard, FaMoneyBill, FaClock, FaCar } from "react-icons/fa";

export default function PaymentPage() {
  const [selectedHours, setSelectedHours] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const pricePerHour = 40; // Example price
  const total = selectedHours * pricePerHour;

  const handlePayment = () => {
    if (!vehicleNumber.trim()) {
      alert("Please enter your vehicle number.");
      return;
    }

    alert(`Payment Successful!\nTotal: ₹${total}\nMethod: ${paymentMethod}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        
        {/* PAGE TITLE */}
        <h1 className="text-2xl font-extrabold text-gray-800 text-center mb-6">
          Complete Your Payment
        </h1>

        {/* LOT INFO */}
        <div className="bg-gray-50 rounded-xl p-4 border mb-6">
          <div className="flex items-center gap-3 text-gray-700">
            <FaCar className="text-blue-600 text-xl" />
            <div>
              <p className="font-bold">Parking Lot XYZ</p>
              <p className="text-sm text-gray-500">Downtown Parking Center</p>
            </div>
          </div>
        </div>

        {/* VEHICLE NUMBER */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700">
            Vehicle Number
          </label>
          <input
            type="text"
            placeholder="Enter your vehicle number"
            className="mt-1 w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
          />
        </div>

        {/* SELECT HOURS */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700">
            Select Duration
          </label>

          <div className="grid grid-cols-3 gap-3 mt-2">
            {[1, 2, 3, 5, 8, 12].map((hr) => (
              <button
                key={hr}
                onClick={() => setSelectedHours(hr)}
                className={`py-2 rounded-lg border text-sm font-semibold transition ${
                  selectedHours === hr
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {hr} hr
              </button>
            ))}
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700">
            Payment Method
          </label>

          <div className="space-y-3 mt-2">
            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-100">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <FaCreditCard className="text-blue-600" />
              <span>Credit / Debit Card</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-100">
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/0c/UPI-Logo-vector.svg"
                alt="UPI"
                className="h-5"
              />
              <span>UPI</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-100">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              <FaMoneyBill className="text-green-600" />
              <span>Cash on Arrival</span>
            </label>
          </div>
        </div>

        {/* BILL SUMMARY */}
        <div className="bg-gray-50 p-4 rounded-xl border mb-6">
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Price per hour:</span>
            <span>₹{pricePerHour}</span>
          </div>

          <div className="flex justify-between text-gray-700 mb-2">
            <span>Hours:</span>
            <span>{selectedHours} hr</span>
          </div>

          <div className="flex
