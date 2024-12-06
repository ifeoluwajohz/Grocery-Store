const { Router } = require('express');

const { getWishlistItems, addItemToWishlist, removeItemFromWishlist, clearWishlist} = require('../controllers/wishListController')
const router = Router();

const authenticate = require('../middleware/Autheticate')



router.get('/get_wishlist', authenticate, getWishlistItems);
router.post('/post_wishlist', authenticate, addItemToWishlist);
router.delete('/delete_wishlist', authenticate, removeItemFromWishlist);
router.delete('/clear_wishlist', authenticate, clearWishlist)

module.exports = router;