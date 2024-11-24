const { Router } = require('express');
const { addProduct, updateProduct, deleteProduct } = require('../controllers/productController');

const router = Router();

router.post('/add', addProduct);
router.put('/update', updateProduct);
router.delete('/delete', deleteProduct);

module.exports = router;
