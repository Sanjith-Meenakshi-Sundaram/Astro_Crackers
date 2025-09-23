// backend/services/emailService.js - Password Reset using Brevo API
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

// Send password reset email using Brevo API
const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    console.log('🔑 Sending password reset email via Brevo API...');
    
    const emailData = {
      sender: {
        name: "Astro Crackers",
        email: process.env.EMAIL_FROM || "crackers.astro@gmail.com"
      },
      to: [{
        email: email,
        name: "User"
      }],
      subject: 'Password Reset Request - Astro Crackers',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Password Reset</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background-color: #f9f9f9;
                    border-radius: 10px;
                    padding: 30px;
                    border: 2px solid #e74c3c;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #e74c3c;
                    margin-bottom: 10px;
                }
                .reset-button {
                    display: inline-block;
                    background-color: #e74c3c;
                    color: white !important;
                    padding: 12px 30px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    margin: 20px 0;
                }
                .warning {
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    color: #856404;
                    padding: 15px;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🎆 Astro Crackers</div>
                    <h2>Password Reset Request</h2>
                </div>
                
                <p>Hello,</p>
                
                <p>We received a request to reset your password for your Astro Crackers account. If you made this request, please click the button below to reset your password:</p>
                
                <div style="text-align: center;">
                    <a href="${resetURL}" class="reset-button">Reset Your Password</a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #007bff;">${resetURL}</p>
                
                <div class="warning">
                    <strong>⚠️ Important:</strong>
                    <ul>
                        <li>This link will expire in <strong>10 minutes</strong></li>
                        <li>If you didn't request this password reset, please ignore this email</li>
                        <li>Your password will remain unchanged if you don't click the link</li>
                    </ul>
                </div>
                
                <div class="footer">
                    <p>Thanks,<br>The Astro Crackers Team</p>
                    <p><em>This is an automated email, please do not reply to this message.</em></p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    const result = await sendEmailViaBrevoAPI(emailData);
    console.log('✅ Password reset email sent successfully via Brevo API:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail
};