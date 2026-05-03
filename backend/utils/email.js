const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
    try {
        let transporter;
        let senderEmail;

        // If credentials exist in .env, use them (Gmail, Outlook, etc.)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            senderEmail = process.env.EMAIL_USER;
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: process.env.SMTP_PORT || 587,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
        } else {
            // Otherwise, automatically create a fake testing account (Ethereal)
            console.log('⚠️ No EMAIL_USER found in .env. Generating a free Ethereal test account...');
            const testAccount = await nodemailer.createTestAccount();
            senderEmail = testAccount.user;
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        }

        const verifyUrl = `http://localhost:5000/api/auth/verify/${token}`;

        const mailOptions = {
            from: `"SmartStyling Assistant" <${senderEmail}>`,
            to: email,
            subject: 'Verify your SmartStyling Account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; color: #4a3b42;">
                    <h2 style="color: #d8b4e2;">Welcome to SmartStyling! ✨</h2>
                    <p>You're just one step away from your personalized AI fashion experience.</p>
                    <p>Please verify your email address by clicking the button below:</p>
                    <a href="${verifyUrl}" style="display: inline-block; margin: 20px 0; padding: 15px 30px; background-color: #d8b4e2; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify My Email</a>
                    <p style="font-size: 12px; color: #8c7a84; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Verification email sent to:', email);
        
        // If we used the test account, print the URL where the user can view the email!
        if (!process.env.EMAIL_USER) {
            console.log('----------------------------------------');
            console.log('📧 TEST EMAIL CAUGHT!');
            console.log('Preview your email here: %s', nodemailer.getTestMessageUrl(info));
            console.log('----------------------------------------');
        }

        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
};

module.exports = { sendVerificationEmail };
