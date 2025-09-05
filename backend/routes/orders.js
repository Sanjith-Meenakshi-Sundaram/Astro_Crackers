const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const protect = require('../middleware/auth'); // Correct import

// @route   POST api/orders
// @desc    Create an order
// @access  Private
router.post('/', protect, orderController.createOrder);

// @route   GET api/orders
// @desc    Get all orders of the logged-in user
// @access  Private
router.get('/', protect, orderController.getOrders);
// @route   GET api/orders/admin
// @desc    Get ALL orders (admin only)
// @access  Private
router.get('/admin', protect, orderController.getAllOrders);
// @route   PATCH api/orders/:id
// @desc    Update order status
// @access  Private  
router.patch('/:id', protect, orderController.updateOrderStatus);
module.exports = router;
