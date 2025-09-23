const nodemailer = require('nodemailer');

// Use the simple and effective 'gmail' service transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 465, // or 465 for SSL
    secure: true, // true if using 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Your beautiful HTML template for the owner
const createOwnerEmailTemplate = (order, user) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.subtotal.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #e74c3c;">🎆 New Order Received - Astro Crackers</h2>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount.toFixed(2)}</p>
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
              <td style="padding: 10px; text-align: right;">₹${order.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
};

// Your beautiful HTML template for the customer
const createCustomerEmailTemplate = (order, user) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.subtotal.toFixed(2)}</td>
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
              <td style="padding: 10px; text-align: right;">₹${order.totalAmount.toFixed(2)}</td>
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
    </div>
  `;
};

// The corrected function to send the emails
const sendOrderConfirmationEmails = async ({ to, user, order }) => {
  const transporter = createTransporter();
  
  try {
    // Email to owner
    const ownerMailOptions = {
      from: `"Astro Crackers Orders" <${process.env.EMAIL_USERNAME}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🎆 New Order #${order.orderNumber} - ₹${order.totalAmount.toFixed(2)}`,
      html: createOwnerEmailTemplate(order, user)
    };

    // Email to customer
    const customerMailOptions = {
      from: `"Astro Crackers" <${process.env.EMAIL_USERNAME}>`,
      to: to,
      subject: `Order Confirmation #${order.orderNumber} - Astro Crackers`,
      html: createCustomerEmailTemplate(order, user)
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    console.log('Emails sent successfully for order:', order.orderNumber);

  } catch (error) {
    console.error('Email sending error:', error);
  }
};

module.exports = {
  sendOrderConfirmationEmails
};
