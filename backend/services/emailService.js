const nodemailer = require("nodemailer");

// Create transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

// Format date and time
const formatDateTime = (date) => {
  return new Date(date).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
};

// Get device and browser info from user agent
const getDeviceInfo = (userAgent) => {
  if (!userAgent) return "Unknown Device";
  
  if (userAgent.includes("Mobile")) return "Mobile Device";
  if (userAgent.includes("Tablet")) return "Tablet";
  return "Desktop Computer";
};

// Send login notification email
const sendLoginEmail = async (email, userAgent, ipAddress) => {
  try {
    // Check if email sending is enabled
    if (process.env.SEND_LOGIN_EMAIL !== "true") {
      console.log("📧 Login email disabled in environment settings");
      return { success: true, message: "Email sending disabled" };
    }

    const transporter = createTransporter();
    const loginTime = formatDateTime(new Date());
    const device = getDeviceInfo(userAgent);

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.GMAIL_USER,
      to: email,
      subject: "🔐 New Login to Your Smart Styling Assistant Account",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px;
              border-radius: 10px;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #667eea;
              margin: 0;
              font-size: 28px;
            }
            .icon {
              font-size: 48px;
              margin-bottom: 10px;
            }
            .info-box {
              background: #f8f9fa;
              border-left: 4px solid #667eea;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e1e8ed;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: 600;
              color: #666;
            }
            .value {
              color: #333;
            }
            .alert {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="header">
                <div class="icon">🔐</div>
                <h1>Login Notification</h1>
              </div>
              
              <p>Hello,</p>
              <p>We detected a new login to your <strong>Smart Styling Assistant</strong> account.</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #667eea;">Login Details</h3>
                <div class="info-row">
                  <span class="label">📧 Email:</span>
                  <span class="value">${email}</span>
                </div>
                <div class="info-row">
                  <span class="label">⏰ Time:</span>
                  <span class="value">${loginTime}</span>
                </div>
                <div class="info-row">
                  <span class="label">💻 Device:</span>
                  <span class="value">${device}</span>
                </div>
                <div class="info-row">
                  <span class="label">🌐 IP Address:</span>
                  <span class="value">${ipAddress || "Unknown"}</span>
                </div>
              </div>
              
              <div class="alert">
                <strong>⚠️ Was this you?</strong><br>
                If you did not log in to your account, please secure your account immediately by changing your password.
              </div>
              
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/dashboard" class="button">
                  Go to Dashboard
                </a>
              </p>
              
              <div class="footer">
                <p>This is an automated email from Smart Styling Assistant.</p>
                <p>If you have any questions, please contact our support team.</p>
                <p style="margin-top: 20px; color: #999; font-size: 12px;">
                  © ${new Date().getFullYear()} Smart Styling Assistant. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Login email sent:", info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error("❌ Error sending login email:", error.message);
    // Don't throw error - email failure shouldn't block login
    return { success: false, error: error.message };
  }
};

// Send registration welcome email
const sendRegistrationEmail = async (email) => {
  try {
    // Check if email sending is enabled
    if (process.env.SEND_REGISTRATION_EMAIL !== "true") {
      console.log("📧 Registration email disabled in environment settings");
      return { success: true, message: "Email sending disabled" };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.GMAIL_USER,
      to: email,
      subject: "🎉 Welcome to Smart Styling Assistant!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px;
              border-radius: 10px;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #667eea;
              margin: 10px 0;
              font-size: 28px;
            }
            .icon {
              font-size: 64px;
              margin-bottom: 10px;
            }
            .feature-box {
              background: #f8f9fa;
              padding: 20px;
              margin: 15px 0;
              border-radius: 8px;
              border-left: 4px solid #667eea;
            }
            .feature-box h3 {
              margin-top: 0;
              color: #667eea;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: 600;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="header">
                <div class="icon">👗</div>
                <h1>Welcome to Smart Styling Assistant!</h1>
                <p style="color: #666; font-size: 18px;">Your AI-Powered Fashion Companion</p>
              </div>
              
              <p>Hello and welcome! 🎉</p>
              <p>Thank you for joining <strong>Smart Styling Assistant</strong>. We're excited to help you discover your perfect style!</p>
              
              <div class="feature-box">
                <h3>✨ What You Can Do:</h3>
                <ul style="margin: 10px 0;">
                  <li>Get personalized outfit recommendations</li>
                  <li>Build your digital wardrobe</li>
                  <li>Discover your unique style profile</li>
                  <li>Save your favorite looks</li>
                </ul>
              </div>
              
              <div class="feature-box">
                <h3>🚀 Getting Started:</h3>
                <ol style="margin: 10px 0;">
                  <li>Complete your style profile</li>
                  <li>Take our style quiz</li>
                  <li>Start generating outfits</li>
                  <li>Build your wardrobe</li>
                </ol>
              </div>
              
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/dashboard" class="button">
                  Get Started Now
                </a>
              </p>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>💡 Pro Tip:</strong> The more information you provide in your profile, the better our AI can personalize recommendations for you!</p>
              </div>
              
              <div class="footer">
                <p>Need help? Visit our help center or contact support.</p>
                <p style="margin-top: 20px; color: #999; font-size: 12px;">
                  © ${new Date().getFullYear()} Smart Styling Assistant. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Registration email sent:", info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error("❌ Error sending registration email:", error.message);
    return { success: false, error: error.message };
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email configuration is valid");
    return { success: true };
  } catch (error) {
    console.error("❌ Email configuration error:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendLoginEmail,
  sendRegistrationEmail,
  testEmailConfig,
};