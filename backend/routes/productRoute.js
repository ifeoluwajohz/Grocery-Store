const { Router } = require('express');
const { searchProduct, getAllProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');

const router = Router();


router.get('/search', searchProduct);

router.get('/get_all', getAllProducts);
router.post('/add', addProduct);
router.put('/update', updateProduct);
router.delete('/delete', deleteProduct);

module.exports = router;
