const { Router } = require('express');
const { searchProduct, getAllProducts, getSingleProduct, getCategory,getAllCategory, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');

const router = Router();


router.get('/search', searchProduct);
router.get('/product/:id', getSingleProduct); 
router.get('/category/:category', getCategory); 
router.get('/categories', getAllCategory); 

router.get('/get_all', getAllProducts);
router.post('/add', addProduct);
router.put('/update', updateProduct);
router.delete('/delete', deleteProduct);

module.exports = router;
