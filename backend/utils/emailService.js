const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email template for owner (you)
const createOwnerEmailTemplate = (order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">₹${item.price}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.subtotal}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #e74c3c;">🎆 New Order Received - Astro Crackers</h2>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
      </div>

      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${order.customerDetails.name}</p>
        <p><strong>Email:</strong> ${order.customerDetails.email}</p>
        <p><strong>Phone:</strong> ${order.customerDetails.phone}</p>
        <p><strong>Address:</strong><br>
           ${order.customerDetails.address.street}<br>
           ${order.customerDetails.address.city}, ${order.customerDetails.address.state}<br>
           PIN: ${order.customerDetails.address.pincode}
        </p>
      </div>

      <div style="margin: 20px 0;">
        <h3>Ordered Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #e74c3c; color: white;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Price</th>
              <th style="padding: 10px; text-align: center;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background: #f8f9fa; font-weight: bold;">
              <td colspan="3" style="padding: 10px; text-align: right;">Total:</td>
              <td style="padding: 10px; text-align: right;">₹${order.totalAmount}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      ${order.notes ? `
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4>Customer Notes:</h4>
          <p>${order.notes}</p>
        </div>
      ` : ''}

      <div style="background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Contact customer at ${order.customerDetails.phone}</li>
          <li>Confirm delivery details and payment method</li>
          <li>Update order status in admin panel</li>
        </ul>
      </div>
    </div>
  `;
};

// Email template for customer
const createCustomerEmailTemplate = (order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">₹${item.price}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.subtotal}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #e74c3c;">🎆 Thank you for your order!</h2>
      
      <div style="background: #d4edda; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order Confirmation</h3>
        <p><strong>Order #${order.orderNumber}</strong> has been successfully received.</p>
        <p>Our team will contact you within 24 hours to confirm delivery details and arrange payment.</p>
      </div>

      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Order Summary</h3>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
      </div>

      <div style="margin: 20px 0;">
        <h3>Your Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #e74c3c; color: white;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Price</th>
              <th style="padding: 10px; text-align: center;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background: #f8f9fa; font-weight: bold;">
              <td colspan="3" style="padding: 10px; text-align: right;">Total:</td>
              <td style="padding: 10px; text-align: right;">₹${order.totalAmount}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Delivery Address</h3>
        <p>
          ${order.customerDetails.address.street}<br>
          ${order.customerDetails.address.city}, ${order.customerDetails.address.state}<br>
          PIN: ${order.customerDetails.address.pincode}
        </p>
      </div>

      <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="margin-top: 0;">Contact Information</h4>
        <p>For any queries, reach out to us:</p>
        <p>📞 Phone: ${process.env.WHATSAPP_NUMBER || '+91-XXXXX-XXXXX'}</p>
        <p>📧 Email: ${process.env.EMAIL_USER}</p>
      </div>

      <div style="text-align: center; margin: 30px 0; color: #666;">
        <p>Thank you for choosing <strong>Astro Crackers</strong>!</p>
        <p style="font-size: 14px;">Making your celebrations brighter! 🎆✨</p>
      </div>
    </div>
  `;
};

// Send order emails
const sendOrderEmails = async (order) => {
  const transporter = createTransporter();
  
  try {
    // Email to owner
    const ownerMailOptions = {
      from: `"Astro Crackers Orders" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `🎆 New Order #${order.orderNumber} - ₹${order.totalAmount}`,
      html: createOwnerEmailTemplate(order)
    };

    // Email to customer
    const customerMailOptions = {
      from: `"Astro Crackers" <${process.env.EMAIL_USER}>`,
      to: order.customerDetails.email,
      subject: `Order Confirmation #${order.orderNumber} - Astro Crackers`,
      html: createCustomerEmailTemplate(order)
    };

    // Send both emails
    const [ownerResult, customerResult] = await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    console.log('Emails sent successfully:', {
      owner: ownerResult.messageId,
      customer: customerResult.messageId
    });

    return {
      success: true,
      ownerEmailSent: true,
      customerEmailSent: true
    };

  } catch (error) {
    console.error('Email sending error:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendOrderEmails
};