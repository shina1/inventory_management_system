const express = require('express');
const { createRole, assignRole } = require('../controllers/roleController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticate, authorize(['manage_roles']), createRole);
router.post('/assign', authenticate, authorize(['manage_roles']), assignRole);

module.exports = router;