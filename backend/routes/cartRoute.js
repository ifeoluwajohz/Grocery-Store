const express = require('express');
const { 
        getCartItem,
        addItemToCart,
        updateCartItem,
        deleteCartItem,
        deleteAllCartItems,
        decreaseCartItemQuantity,
        increaseCartItemQuantity,
        } = require('../controllers/cartController');
const authenticate = require('../middleware/Autheticate')
const router = express.Router();

// Route to add item to cart
router.get('/get_cartItems', authenticate, getCartItem);

// Route to add item to cart
router.post('/cart_post', authenticate, addItemToCart);

router.patch('/cart/:productId/decrease',authenticate,  decreaseCartItemQuantity);

router.patch('/cart/:productId/increase',authenticate,  increaseCartItemQuantity);
// Route to update cart item quantity

// Route to delete item from cart
router.delete('/cart_delete/:productId', authenticate, deleteCartItem);

router.delete('/delete_all', authenticate, deleteAllCartItems);


module.exports = router;
