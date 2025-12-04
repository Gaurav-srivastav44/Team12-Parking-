# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "driver",
  "vehicleNumber": "ABC123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "driver",
      "vehicleNumber": "ABC123"
    },
    "token": "jwt_token_here"
  }
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

### Logout
**POST** `/auth/logout`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Note:** Since JWT tokens are stateless and this endpoint is public, the client is responsible for removing any stored token on logout.

---

## Parking Lot Endpoints (3 endpoints)

### Get All Parking Lots
**GET** `/parking`

**Description:** Returns a simple list of all parking lots. You can later add filters if needed.

### Get Single Parking Lot
**GET** `/parking/:id`

**Description:** Returns details of one parking lot, including basic availability summary.

### Create Parking Lot
**POST** `/parking` (Protected - Manager/Admin)

**Request Body (minimal example):**
```json
{
  "name": "Downtown Parking",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "location": {
    "type": "Point",
    "coordinates": [72.8777, 19.0760]
  },
  "totalSlots": 50
}
```

---

## Booking Endpoints (3 endpoints)

### Create Booking
**POST** `/bookings` (Protected - Driver)

**Minimal Request Body:**
```json
{
  "parkingLotId": "parking_lot_id",
  "slotId": "slot_id",
  "vehicleNumber": "ABC123"
}
```

### Get User Bookings
**GET** `/bookings` (Protected)

**Description:** Returns all bookings for the current logged-in user.

### Update Booking
**PUT** `/bookings/:id` (Protected)

**Request Body Example:**
```json
{
  "action": "cancel",
  "reason": "User cancelled"
}
```

---

## Notification Endpoints (3 endpoints)

### Get Notifications
**GET** `/notifications` (Protected)

### Mark Notification as Read
**PUT** `/notifications/:id/read` (Protected)

### Delete Notification
**DELETE** `/notifications/:id` (Protected)

---

## Dashboard Endpoints

### Driver Dashboard
**GET** `/dashboard/driver` (Protected - Driver)

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "activeBookings": 2,
      "totalBookings": 15
    },
    "recentBookings": [ ... ]
  }
}
```

### Manager Dashboard
**GET** `/dashboard/manager` (Protected - Manager/Admin)

**Query Parameters:**
- `parkingLotId` (string): Specific parking lot (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalParkingLots": 3,
      "totalSlots": 150,
      "availableSlots": 45,
      "occupiedSlots": 105,
      "occupancyRate": "70.00",
      "todayBookings": 25,
      "revenue30Days": 50000,
      "peakHours": [
        { "hour": 9, "count": 45 },
        { "hour": 14, "count": 38 },
        { "hour": 18, "count": 42 }
      ]
    },
    "parkingLots": [ ... ]
  }
}
```

### Admin Dashboard
**GET** `/dashboard/admin` (Protected - Admin)

---

## WebSocket Events

### Client → Server Events

#### Join Parking Lot Room
```javascript
socket.emit('join-parking-lot', parkingLotId);
```

#### Leave Parking Lot Room
```javascript
socket.emit('leave-parking-lot', parkingLotId);
```

#### Join User Room
```javascript
socket.emit('join-user', userId);
```

#### Update Slot Status (Manager/IoT)
```javascript
socket.emit('update-slot-status', {
  slotId: 'slot_id',
  status: 'occupied',
  parkingLotId: 'parking_lot_id'
});
```

### Server → Client Events

#### Parking Lot Status
```javascript
socket.on('parking-lot-status', (data) => {
  // data: { parkingLotId, availableSlots, occupiedSlots, totalSlots }
});
```

#### Slot Updated
```javascript
socket.on('slot-updated', (data) => {
  // data: { slotId, status, parkingLotId, availableSlots, occupiedSlots }
});
```

#### Booking Updated
```javascript
socket.on('booking-updated', (data) => {
  // data: { bookingId, status, ... }
});
```

#### Notification
```javascript
socket.on('notification', (data) => {
  // data: { type, title, message, ... }
});
```

---

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

Currently, there's no rate limiting implemented. Consider adding it for production use.

---

## Notes

1. All timestamps are in ISO 8601 format
2. Coordinates use GeoJSON format: `[longitude, latitude]`
3. Prices are in the currency specified (default: INR)
4. All protected routes require a valid JWT token
5. Role-based access control is enforced on all endpoints

