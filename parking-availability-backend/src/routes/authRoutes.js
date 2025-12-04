const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout); // Public logout endpoint

module.exports = router;

