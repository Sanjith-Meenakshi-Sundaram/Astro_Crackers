const axios = require('axios');

// Brevo API configuration
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// Send email via Brevo API
const sendEmailViaBrevoAPI = async (emailData) => {
  try {
    const response = await axios.post(BREVO_API_URL, emailData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      timeout: 30000 // 30 seconds timeout
    });

    return {
      success: true,
      messageId: response.data.messageId || 'sent',
      response: response.data
    };

  } catch (error) {
    console.error('❌ Brevo API Error:', error.response?.data || error.message);
    throw new Error(`Brevo API failed: ${error.response?.data?.message || error.message}`);
  }
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

// The corrected function to send the emails using Brevo API
const sendOrderConfirmationEmails = async ({ to, user, order }) => {
  try {
    console.log('📧 Sending order confirmation emails via Brevo API...');

    // Email data for owner
    const ownerEmailData = {
      sender: {
        name: "Astro Crackers",
        email: process.env.EMAIL_FROM || "crackers.astro@gmail.com"
      },
      to: [{
        email: process.env.ADMIN_EMAIL,
        name: "Admin"
      }],
      subject: `🎆 New Order #${order.orderNumber} - ₹${order.totalAmount.toFixed(2)}`,
      htmlContent: createOwnerEmailTemplate(order, user)
    };

    // Email data for customer
    const customerEmailData = {
      sender: {
        name: "Astro Crackers",
        email: process.env.EMAIL_FROM || "crackers.astro@gmail.com"
      },
      to: [{
        email: to,
        name: order.customerDetails.name || "Customer"
      }],
      subject: `Order Confirmation #${order.orderNumber} - Astro Crackers`,
      htmlContent: createCustomerEmailTemplate(order, user)
    };

    // Send both emails using Promise.all for parallel execution
    const [ownerResult, customerResult] = await Promise.all([
      sendEmailViaBrevoAPI(ownerEmailData),
      sendEmailViaBrevoAPI(customerEmailData)
    ]);

    console.log('✅ Owner email sent successfully:', ownerResult.messageId);
    console.log('✅ Customer email sent successfully:', customerResult.messageId);
    console.log('✅ All order confirmation emails sent for order:', order.orderNumber);

    return {
      success: true,
      ownerMessageId: ownerResult.messageId,
      customerMessageId: customerResult.messageId
    };

  } catch (error) {
    console.error('❌ Error sending order confirmation emails:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendOrderConfirmationEmails
};