const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, owner } = require('../middleware/ownerAuth');

// IMPORTANT: Admin routes must come BEFORE general routes
// @route   GET api/orders/admin
// @desc    Get ALL orders (admin only)
// @access  Private (Admin only)
router.get('/admin', protect, owner, orderController.getAllOrders);

// @route   PATCH api/orders/:id
// @desc    Update order status
// @access  Private (Admin only)
router.patch('/:id', protect, owner, orderController.updateOrderStatus);

// @route   POST api/orders
// @desc    Create an order
// @access  Private
router.post('/', protect, orderController.createOrder);

// @route   GET api/orders
// @desc    Get all orders of the logged-in user
// @access  Private
router.get('/', protect, orderController.getOrders);

module.exports = router;