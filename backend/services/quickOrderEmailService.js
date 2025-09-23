const nodemailer = require('nodemailer');

// Create transporter using Gmail service
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // TLS is used with STARTTLS on port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Beautiful HTML template for the shop owner
const createOwnerEmailTemplate = (order, user) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: 500;">${item.productName}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center; font-weight: 600;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-weight: 600; color: #e74c3c;">₹${item.subtotal.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🎆 ASTRO CRACKERS</h1>
        <p style="color: #fff; margin: 10px 0 0 0; font-size: 18px;">New Quick Order Received!</p>
        <div style="background: #fff; color: #e74c3c; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-top: 15px; font-weight: bold; font-size: 16px;">
          Order #${order.orderNumber}
        </div>
      </div>

      <!-- Content -->
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Order Summary -->
        <div style="background: #fff5f5; border: 2px solid #fed7d7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #e74c3c; margin-top: 0; font-size: 20px;">📋 Order Summary</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <p style="margin: 8px 0;"><strong>Order Date:</strong><br>${new Date(order.createdAt).toLocaleDateString('en-IN')} at ${new Date(order.createdAt).toLocaleTimeString('en-IN')}</p>
            <p style="margin: 8px 0;"><strong>Total Items:</strong><br>${order.items.reduce((sum, item) => sum + item.quantity, 0)} pieces</p>
            <p style="margin: 8px 0;"><strong>Total Savings:</strong><br><span style="color: #27ae60; font-weight: bold;">₹${order.totalSavings ? order.totalSavings.toFixed(2) : '0.00'}</span></p>
            <p style="margin: 8px 0;"><strong>Final Amount:</strong><br><span style="color: #e74c3c; font-weight: bold; font-size: 18px;">₹${order.totalAmount.toFixed(2)}</span></p>
          </div>
        </div>

        <!-- Customer Details -->
        <div style="background: #f0f8ff; border: 2px solid #bee5eb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #17a2b8; margin-top: 0; font-size: 20px;">👤 Customer Information</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <p style="margin: 8px 0;"><strong>Name:</strong><br>${user.name}</p>
            <p style="margin: 8px 0;"><strong>Phone:</strong><br><a href="tel:${user.phone}" style="color: #17a2b8; text-decoration: none;">${user.phone}</a></p>
          </div>
          <p style="margin: 8px 0;"><strong>Email:</strong><br><a href="mailto:${user.email}" style="color: #17a2b8; text-decoration: none;">${user.email}</a></p>
          <p style="margin: 8px 0;"><strong>Delivery Address:</strong><br>
            ${order.customerDetails.address.street}<br>
            ${order.customerDetails.address.city}, ${order.customerDetails.address.state}<br>
            <strong>PIN:</strong> ${order.customerDetails.address.pincode}
          </p>
        </div>

        <!-- Ordered Items -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #333; font-size: 20px;">🛒 Ordered Items</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white;">
                  <th style="padding: 15px; text-align: left; font-weight: bold;">Product Name</th>
                  <th style="padding: 15px; text-align: center; font-weight: bold;">Price</th>
                  <th style="padding: 15px; text-align: center; font-weight: bold;">Quantity</th>
                  <th style="padding: 15px; text-align: right; font-weight: bold;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr style="background: #f8f9fa; border-top: 2px solid #e74c3c;">
                  <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold; font-size: 16px;">TOTAL AMOUNT:</td>
                  <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #e74c3c;">₹${order.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Action Required -->
        <div style="background: #fff3cd; border: 2px solid #ffeaa7; padding: 20px; border-radius: 8px; text-align: center;">
          <h3 style="color: #856404; margin-top: 0;">⚡ Action Required</h3>
          <p style="margin: 10px 0; color: #856404; font-size: 16px;">
            <strong>Please contact the customer within 24 hours to confirm delivery details and arrange payment.</strong>
          </p>
          <div style="margin-top: 15px;">
            <a href="tel:${user.phone}" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 0 5px; display: inline-block;">📞 Call Customer</a>
            <a href="mailto:${user.email}" style="background: #17a2b8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 0 5px; display: inline-block;">📧 Email Customer</a>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
        <p style="margin: 5px 0;">🎆 <strong>ASTRO CRACKERS</strong> - Direct Factory Outlet</p>
        <p style="margin: 5px 0;">📞 +91 8300372046 | 📧 crackers.astro@gmail.com</p>
        <p style="margin: 5px 0; font-style: italic;">Making your celebrations brighter! ✨</p>
      </div>
    </div>
  `;
};

// Beautiful HTML template for the customer
const createCustomerEmailTemplate = (order, user) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: 500;">${item.productName}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center; font-weight: 600;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-weight: 600; color: #e74c3c;">₹${item.subtotal.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🎆 ASTRO CRACKERS</h1>
        <p style="color: #fff; margin: 10px 0 0 0; font-size: 18px;">Thank you for your order!</p>
      </div>

      <!-- Content -->
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Thank You Message -->
        <div style="background: #d4edda; border: 2px solid #c3e6cb; padding: 25px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
          <h2 style="color: #155724; margin-top: 0; font-size: 24px;">✅ Order Confirmed Successfully!</h2>
          <p style="margin: 15px 0; color: #155724; font-size: 18px; font-weight: 500;">
            Dear ${user.name}, your order <strong>#${order.orderNumber}</strong> has been received.
          </p>
          <p style="margin: 10px 0; color: #155724; font-size: 16px;">
            Our team will contact you within <strong>24 hours</strong> to confirm delivery details and arrange payment.
          </p>
        </div>

        <!-- Order Details -->
        <div style="background: #fff5f5; border: 2px solid #fed7d7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #e74c3c; margin-top: 0; font-size: 20px;">📋 Order Details</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <p style="margin: 8px 0;"><strong>Order Number:</strong><br>${order.orderNumber}</p>
            <p style="margin: 8px 0;"><strong>Order Date:</strong><br>${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
            <p style="margin: 8px 0;"><strong>Total Items:</strong><br>${order.items.reduce((sum, item) => sum + item.quantity, 0)} pieces</p>
            <p style="margin: 8px 0;"><strong>You Saved:</strong><br><span style="color: #27ae60; font-weight: bold;">₹${order.totalSavings ? order.totalSavings.toFixed(2) : '0.00'}</span></p>
          </div>
          <div style="text-align: center; margin-top: 15px; padding: 15px; background: white; border-radius: 5px;">
            <p style="margin: 0; font-size: 20px; color: #e74c3c; font-weight: bold;">Total Amount: ₹${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <!-- Your Items -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #333; font-size: 20px;">🛒 Your Items</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white;">
                  <th style="padding: 15px; text-align: left; font-weight: bold;">Product Name</th>
                  <th style="padding: 15px; text-align: center; font-weight: bold;">Price</th>
                  <th style="padding: 15px; text-align: center; font-weight: bold;">Quantity</th>
                  <th style="padding: 15px; text-align: right; font-weight: bold;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr style="background: #f8f9fa; border-top: 2px solid #e74c3c;">
                  <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold; font-size: 16px;">TOTAL AMOUNT:</td>
                  <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #e74c3c;">₹${order.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Delivery Address -->
        <div style="background: #f0f8ff; border: 2px solid #bee5eb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #17a2b8; margin-top: 0; font-size: 20px;">🏠 Delivery Address</h3>
          <p style="margin: 10px 0; line-height: 1.6; font-size: 16px;">
            ${order.customerDetails.address.street}<br>
            ${order.customerDetails.address.city}, ${order.customerDetails.address.state}<br>
            <strong>PIN:</strong> ${order.customerDetails.address.pincode}
          </p>
        </div>

        <!-- Next Steps -->
        <div style="background: #fff3cd; border: 2px solid #ffeaa7; padding: 20px; border-radius: 8px; text-align: center;">
          <h3 style="color: #856404; margin-top: 0;">📞 What Happens Next?</h3>
          <ul style="text-align: left; color: #856404; font-size: 16px; line-height: 1.8; margin: 15px 0; padding-left: 20px;">
            <li>Our team will call you within 24 hours</li>
            <li>We'll confirm your delivery address and preferred time</li>
            <li>Payment will be collected at the time of delivery</li>
            <li>Transportation charges will be added as applicable</li>
          </ul>
        </div>

      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
        <p style="margin: 5px 0;">🎆 <strong>ASTRO CRACKERS</strong> - Direct Factory Outlet</p>
        <p style="margin: 5px 0;">📞 +91 8300372046 | 📧 crackers.astro@gmail.com</p>
        <p style="margin: 5px 0; font-style: italic;">Making your celebrations brighter! ✨</p>
        <div style="margin-top: 15px;">
          <p style="margin: 5px 0; font-size: 12px; color: #999;">
            For any queries, feel free to contact us. We're here to help! 😊
          </p>
        </div>
      </div>
    </div>
  `;
};

// Main function to send both emails
const sendQuickOrderConfirmationEmails = async ({ to, user, order }) => {
  const transporter = createTransporter();

  try {
    // Email to shop owner
    const ownerMailOptions = {
      from: `"Astro Crackers - Quick Orders" <${process.env.EMAIL_USERNAME}>`,
      to: process.env.ADMIN_EMAIL, // Your admin email
      subject: `🎆 NEW Quick Order #${order.orderNumber} - ₹${order.totalAmount.toFixed(2)} | Contact: ${user.phone}`,
      html: createOwnerEmailTemplate(order, user)
    };

    // Email to customer
    const customerMailOptions = {
      from: `"Astro Crackers" <${process.env.EMAIL_USERNAME}>`,
      to: to,
      subject: `✅ Order Confirmed #${order.orderNumber} - Astro Crackers | We'll call you soon!`,
      html: createCustomerEmailTemplate(order, user)
    };

    // Send both emails simultaneously
    const [ownerResult, customerResult] = await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    console.log('✅ Owner email sent:', ownerResult.messageId);
    console.log('✅ Customer email sent:', customerResult.messageId);
    console.log('🎆 Quick order emails sent successfully for order:', order.orderNumber);

    return {
      success: true,
      ownerEmailId: ownerResult.messageId,
      customerEmailId: customerResult.messageId
    };

  } catch (error) {
    console.error('❌ Quick order email sending error:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

module.exports = {
  sendQuickOrderConfirmationEmails
};