// authRoute.js
const express = require('express');
const { registerUser, loginUser, profile } = require('../controllers/authControllers'); // Make sure this path is correct

const router = express.Router();

// Define your routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', profile)

// Export the router
module.exports = router;
