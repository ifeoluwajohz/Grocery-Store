const express = require('express');
const { getCartItem, addItemToCart, updateCartItem, deleteCartItem } = require('../controllers/cartController');
const router = express.Router();

// Route to add item to cart
router.get('/cart', getCartItem);

// Route to add item to cart
router.post('/cart', addItemToCart);

// Route to update cart item quantity
router.put('/cart', updateCartItem);

// Route to delete item from cart
router.delete('/cart', deleteCartItem);

module.exports = router;
