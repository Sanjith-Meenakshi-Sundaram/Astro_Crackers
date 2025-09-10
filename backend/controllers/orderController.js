const Order = require('../models/Order');
const User = require('../models/User');
const { sendOrderConfirmationEmails } = require('../utils/emailService');

// Helper function to generate a unique, readable order number
const generateOrderNumber = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AC-${year}${month}${day}-${randomPart}`;
};

exports.createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { cartItems, address, phone } = req.body;

    if (!cartItems || cartItems.length === 0 || !address || !phone) {
      return res.status(400).json({ message: 'Missing required fields for order' });
    }
    
    if (!address.street || !address.city || !address.state || !address.pincode) {
      return res.status(400).json({ message: 'A complete address (street, city, state, pincode) is required.' });
    }

    const items = cartItems.map(item => ({
      productId: item.productId,
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }));

    const totalAmount = items.reduce((acc, item) => acc + item.subtotal, 0);
    const orderNumber = generateOrderNumber();

    const newOrder = new Order({
      orderNumber: orderNumber,
      user: user._id,
      customerDetails: {
        name: user.name,
        email: user.email,
        phone: phone,
        address: {
          street: address.street,
          city: address.city,
          state: address.state,
          pincode: address.pincode
        }
      },
      items: items,
      totalAmount: totalAmount,
    });

    const savedOrder = await newOrder.save();

    // Send confirmation email
    await sendOrderConfirmationEmails({
      to: user.email,
      user: user,
      order: savedOrder,
    });

    res.status(201).json({ message: 'Order created successfully!', order: savedOrder });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
};

// 📌 NEW: Fetch all orders for the logged-in user
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    // if (!orders || orders.length === 0) {
    //   return res.status(404).json({ message: 'No orders found for this user' });
    // }
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};
// Get ALL orders (for admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

// NEW: Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({ 
      message: 'Order status updated successfully', 
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    res.status(500).json({ message: 'Server error while updating order status' });
  }
};