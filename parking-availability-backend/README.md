# Parking Slot Availability Checker - Backend API

A comprehensive backend system for real-time parking slot availability management. Built with Node.js, Express, MongoDB, and Socket.io for real-time updates.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Driver, Manager, Admin)
  - User profile management

- **Parking Lot Management**
  - Create and manage parking lots
  - Location-based search with geospatial queries
  - Filter by type, price, and features
  - Real-time slot availability tracking

- **Slot Management**
  - Create and update parking slots
  - Multiple slot types (regular, covered, EV charging, handicap)
  - Real-time status updates (available, occupied, reserved, maintenance)
  - IoT sensor integration support

- **Booking System**
  - Instant and reservation-based bookings
  - Booking lifecycle management (pending, confirmed, active, completed, cancelled)
  - Automatic pricing calculation
  - Payment status tracking

- **Real-Time Updates**
  - WebSocket support for live slot availability
  - Real-time notifications
  - Live occupancy dashboards

- **Notifications**
  - Booking confirmations and updates
  - Slot availability alerts
  - Reservation expiry reminders
  - Payment status notifications

- **Dashboard & Analytics**
  - Driver dashboard (active bookings, history)
  - Manager dashboard (occupancy, revenue, peak hours)
  - Admin dashboard (system-wide statistics)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Real-Time**: Socket.io
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **Validation**: express-validator

## Installation

1. **Clone the repository**
   ```bash
   cd parking-availability-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your configuration:
   - MongoDB connection string
   - JWT secret key
   - Other optional configurations

4. **Start the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication (3 endpoints)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Parking Lots (3 endpoints)
- `GET /api/parking` - Get all parking lots
- `GET /api/parking/:id` - Get single parking lot (with availability summary)
- `POST /api/parking` - Create parking lot (Manager/Admin)

### Bookings (3 endpoints)
- `POST /api/bookings` - Create booking (Driver)
- `GET /api/bookings` - Get current user's bookings
- `PUT /api/bookings/:id` - Update booking (start/end/cancel)

### Notifications (3 endpoints)
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

### Dashboard
- `GET /api/dashboard/driver` - Driver dashboard (Driver)
- `GET /api/dashboard/manager` - Manager dashboard (Manager/Admin)
- `GET /api/dashboard/admin` - Admin dashboard (Admin)

## WebSocket Events

### Client → Server
- `join-parking-lot` - Join parking lot room for updates
- `leave-parking-lot` - Leave parking lot room
- `join-user` - Join user room for notifications
- `leave-user` - Leave user room
- `update-slot-status` - Update slot status (Manager/IoT)

### Server → Client
- `parking-lot-status` - Current parking lot availability
- `slot-updated` - Slot status changed
- `booking-updated` - Booking status changed
- `notification` - New notification received

## Database Models

### User
- Authentication and profile information
- Roles: driver, manager, admin
- Vehicle information for drivers

### ParkingLot
- Parking facility information
- Location (latitude, longitude)
- Pricing structure
- Features and slot types
- Real-time occupancy counts

### Slot
- Individual parking slot
- Type, status, location
- Current booking reference
- Sensor integration support

### Booking
- Booking details and lifecycle
- Pricing and payment information
- Start/end times and duration

### Notification
- User notifications
- Related booking/parking lot references
- Read status tracking

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Role-Based Access Control

- **Driver**: Can create bookings, view own bookings and notifications
- **Manager**: Can manage parking lots and slots, view analytics
- **Admin**: Full system access

## Real-Time Features

The system uses Socket.io for real-time updates:

1. **Slot Availability**: Drivers receive instant updates when slots become available/occupied
2. **Notifications**: Real-time push notifications for booking updates
3. **Occupancy Dashboard**: Managers see live occupancy statistics

## Example API Requests

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "driver",
  "vehicleNumber": "ABC123"
}
```

### Create Parking Lot
```bash
POST /api/parking
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Downtown Parking",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "location": {
    "latitude": 19.0760,
    "longitude": 72.8777
  },
  "totalSlots": 50,
  "pricing": {
    "baseRate": 20,
    "hourlyRate": 10
  },
  "features": {
    "covered": true,
    "evCharging": false,
    "handicapAccessible": true
  }
}
```

### Create Booking
```bash
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "parkingLotId": "parking_lot_id",
  "slotId": "slot_id",
  "vehicleNumber": "ABC123",
  "bookingType": "instant"
}
```

## Error Handling

The API uses consistent error responses:
```json
{
  "success": false,
  "message": "Error message"
}
```

## Development

### Project Structure
```
parking-availability-backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth and other middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── socket/          # Socket.io handlers
│   └── utils/           # Utility functions
├── server.js            # Main server file
├── package.json
└── .env                 # Environment variables
```

## Future Enhancements

- [ ] Redis caching for improved performance
- [ ] Payment gateway integration
- [ ] Google Maps API integration
- [ ] IoT sensor webhook endpoints
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Rate limiting
- [ ] API documentation with Swagger

## License

This project is part of a hackathon submission.

## Support

For issues and questions, please contact the development team.

