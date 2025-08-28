const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Correctly import the 'protect' and 'owner' functions
const { protect, owner } = require('../middleware/ownerAuth');

// All routes in this file are protected and require owner privileges
// This syntax applies both middleware functions in order.
router.post('/products', [protect, owner], adminController.addProduct);
router.put('/products/:id', [protect, owner], adminController.updateProduct);
router.delete('/products/:id', [protect, owner], adminController.deleteProduct);

module.exports = router;