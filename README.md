# 🚗 Smart Parking Slot Management System  
A modern full-stack parking management solution with **real-time updates**, **slot reservation**, **admin/manager panel**, **map-based search**, and **smart notifications**.

#🔗 Live Demo
👉 Parking Manager Demo:
https://lustrous-licorice-dc7743.netlify.app/
(Replace with your actual deployed URL—Vercel, Netlify, Render, etc.)

## 📌 Features

### 👤 User Features
- 🔐 Login with role-based routing (User / Manager / Admin)
- 📍 Find nearby parking lots (list & map view)
- 🎯 Slot booking and reservation timer
- 🗺️ Map Picker for selecting custom user location
- 📢 Real-time notifications (slot expiry alerts, reservation alerts)
- 🔎 Search lots by name or address
- 🎛️ Advanced filters  
  - Covered  
  - Open-air  
  - EV Charging  
  - Handicap Accessible

---

### 🛠️ Manager / Admin Dashboard
- 📊 Dashboard overview  
  - Total lots  
  - Total slots  
  - Available slots  
  - Reservations  
- ➕ Add / Edit / Activate / Deactivate Parking Lots  
- 🚗 Manage individual slots  
  - Available / Occupied / Reserved / Maintenance  
- ⚡ Live IoT Simulation  
  - Auto-update slot status  
- 📄 Report Generation  
  - Revenue  
  - Peak hour  
  - Occupied vs Available  
- 🔄 Live refresh mode (polling every 5 seconds)

---

### 🧱 Tech Stack
#### **Frontend**
- React.js  
- React Router  
- Tailwind CSS  
- React Icons  
- @react-google-maps/api (optional)

#### **Backend (Mock for now)**
- Mock API service (`mockApi.js`)  
- Local session & token-based mock authentication  

---

## 📁 Project Structure

