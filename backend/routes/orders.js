const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
// CHANGE THIS LINE:
const protect = require('../middleware/auth'); // Remove the curly braces {}

// @route   POST api/orders
// @desc    Create an order
// @access  Private
router.post('/', protect, orderController.createOrder); // Now 'protect' is the function itself

module.exports = router;