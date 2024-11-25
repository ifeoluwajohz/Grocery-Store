require('dotenv').config;
// index.js
const express = require('express');
const authRoutes = require('./routes/authRoute'); // Correct path to your authRoute.js file
const UserProduct = require('./routes/userProductRoute')
const productRoutes = require('./routes/productRoute');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

prisma.user.findMany().then(user => console.log(user));

// Middleware to parse JSON
app.use(express.json());

// Use the auth routes
app.use('/user', authRoutes); // Use the routes exported from authRoute.js
app.use('/user', UserProduct)
app.use('/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
