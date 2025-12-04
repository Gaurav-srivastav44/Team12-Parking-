# Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

## Step-by-Step Setup

### 1. Install Dependencies
```bash
cd parking-availability-backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/parking-availability

# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/parking-availability

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
JWT_EXPIRE=30d

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

**MongoDB Atlas:**
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string
- Update `MONGO_URI` in `.env`

### 4. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
MongoDB Connected: ...
Server running on port 5000
Environment: development
Scheduled tasks initialized
```

### 5. Test the API

**Check if server is running:**
```bash
curl http://localhost:5000
```

**Register a test user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890",
    "role": "driver"
  }'
```

## Creating Test Data

### 1. Register a Manager
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Parking Manager",
    "email": "manager@example.com",
    "password": "password123",
    "phone": "9876543210",
    "role": "manager"
  }'
```

### 2. Login as Manager
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@example.com",
    "password": "password123"
  }'
```

Save the token from the response.

### 3. Create a Parking Lot
```bash
curl -X POST http://localhost:5000/api/parking \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Downtown Parking",
    "address": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001"
    },
    "latitude": 19.0760,
    "longitude": 72.8777,
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
  }'
```

### 4. Create Slots
```bash
curl -X POST http://localhost:5000/api/parking/PARKING_LOT_ID/slots \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "slotNumber": "A-101",
    "type": "covered"
  }'
```

Repeat for multiple slots.

## Testing WebSocket Connection

Use a WebSocket client or browser console:

```javascript
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to server');
  
  // Join parking lot room
  socket.emit('join-parking-lot', 'PARKING_LOT_ID');
});

socket.on('parking-lot-status', (data) => {
  console.log('Parking lot status:', data);
});

socket.on('slot-updated', (data) => {
  console.log('Slot updated:', data);
});
```

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Verify network connectivity for Atlas

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using port 5000

### JWT Secret Error
- Ensure `JWT_SECRET` is set in `.env`
- Use a strong, random secret (minimum 32 characters)

### CORS Error
- Update `CLIENT_URL` in `.env` to match your frontend URL
- Or set to `*` for development (not recommended for production)

## Next Steps

1. Integrate with your frontend application
2. Set up payment gateway (optional)
3. Configure Google Maps API (optional)
4. Set up Redis for caching (optional)
5. Deploy to production (Heroku, AWS, etc.)

## Production Checklist

- [ ] Change `JWT_SECRET` to a strong, random value
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or managed database
- [ ] Configure proper CORS origins
- [ ] Set up SSL/HTTPS
- [ ] Add rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure environment variables securely
- [ ] Set up automated backups
- [ ] Review and update security settings

