const express = require('express');
const router = express.Router();
const { sendQuickOrderConfirmationEmails } = require('../services/quickOrderEmailService');

// POST /api/quick-orders/send-confirmation
router.post('/send-confirmation', async (req, res) => {
  try {
    console.log('Quick order confirmation request received');
    
    const { to, user, order } = req.body;
    
    // Validation
    if (!to || !user || !order) {
      return res.status(400).json({ 
        error: 'Missing required fields: to, user, or order' 
      });
    }

    if (!user.name || !user.email || !user.phone) {
      return res.status(400).json({ 
        error: 'Missing required user fields: name, email, or phone' 
      });
    }

    if (!order.items || order.items.length === 0) {
      return res.status(400).json({ 
        error: 'Order must contain at least one item' 
      });
    }

    // Send emails using the service
    await sendQuickOrderConfirmationEmails({ to, user, order });
    
    console.log('Quick order emails sent successfully for order:', order.orderNumber);
    
    res.json({ 
      success: true, 
      message: 'Order confirmation emails sent successfully',
      orderNumber: order.orderNumber 
    });

  } catch (error) {
    console.error('Quick order email sending error:', error);
    res.status(500).json({ 
      error: 'Failed to send confirmation emails',
      details: error.message 
    });
  }
});

module.exports = router;