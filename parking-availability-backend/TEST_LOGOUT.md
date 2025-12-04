# Testing Logout API

## Endpoint
**POST** `http://localhost:5000/api/auth/logout`

## Steps to Test

### 1. First, Login to get a token:
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Copy the token and use it for logout:
```bash
POST http://localhost:5000/api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Logout successful",
  "data": {
    "userId": "user_id_here"
  }
}
```

## Common Issues

### Issue 1: 401 Unauthorized
**Error:** `"Not authorized to access this route"`

**Solution:** 
- Make sure you're including the token in the Authorization header
- Format: `Authorization: Bearer <your_token>`
- Make sure there's a space between "Bearer" and the token

### Issue 2: 404 Not Found
**Error:** `"Route not found"`

**Solution:**
- Make sure the server is running
- Check the URL: `http://localhost:5000/api/auth/logout`
- Make sure you're using POST method, not GET

### Issue 3: Server not responding
**Solution:**
- Restart the server: `npm run dev`
- Check if MongoDB is connected
- Check console for errors

## Using Postman/Thunder Client

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/auth/logout`
3. **Headers:**
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`
4. **Body:** None (empty)

## Using cURL

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Using JavaScript/Fetch

```javascript
fetch('http://localhost:5000/api/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => {
  console.log(data);
  // Remove token from localStorage
  localStorage.removeItem('token');
})
.catch(err => console.error(err));
```

