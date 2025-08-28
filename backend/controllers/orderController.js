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

    // *** THE FIX IS HERE ***
    // We now pass the correct arguments to the email service.
    await sendOrderConfirmationEmails({
      to: user.email,
      user: user, // Pass the full user object
      order: savedOrder, // Pass the saved order object
    });

    res.status(201).json({ message: 'Order created successfully!', order: savedOrder });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
};
