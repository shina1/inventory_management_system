const express = require('express');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  getCategoryProducts,
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticate, authorize(['manage_products']), createProduct);
router.put('/:id', authenticate, authorize(['manage_products']), updateProduct);
router.delete(
  '/:id',
  authenticate,
  authorize(['manage_products']),
  deleteProduct
);
router.get('/', authenticate, getAllProducts);
router.get('/:id', authenticate, getProduct);
router.get('/category/:id', authenticate, getCategoryProducts);

module.exports = router;
