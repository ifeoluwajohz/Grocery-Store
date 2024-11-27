require('dotenv').config;
// index.js
const express = require('express');
const authRoutes = require('./routes/authRoute'); // Correct path to your authRoute.js file
const cartRoute = require('./routes/cartRoute')
const productRoutes = require('./routes/productRoute');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const app = express();


// Allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // If using cookies/auth headers
}));


const prisma = new PrismaClient();

// prisma.user.findMany().then(user => console.log(user.name));

// Middleware to parse JSON
app.use(express.json());

// Use the auth routes
app.use('/user', authRoutes); // Use the routes exported from authRoute.js
app.use('/user', cartRoute)
app.use('/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
