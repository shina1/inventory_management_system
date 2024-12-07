const express = require('express');
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories
} = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticate, authorize(['manage_categories']), createCategory);
router.put('/:id', authenticate, authorize(['manage_categories']), updateCategory);
router.delete('/:id', authenticate, authorize(['manage_categories']), deleteCategory);
router.get('/', authenticate, getCategories);

module.exports = router;