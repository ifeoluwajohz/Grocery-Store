// authRoute.js
const express = require('express');
const { registerUser, loginUser, profile } = require('../controllers/authControllers'); // Make sure this path is correct
const authenticate = require('../middleware/Autheticate')

const router = express.Router();

// Define your routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile',authenticate, profile)

// Export the router
module.exports = router;
