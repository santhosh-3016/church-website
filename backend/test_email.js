const nodemailer = require('nodemailer');
require('dotenv').config();

console.log("--- Email Delivery Test ---");
console.log("User:", process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS?.replace(/\s+/g, '')
    }
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Sending to yourself to test
    subject: 'Test Email from Church Website',
    text: 'If you are reading this, the email configuration is 100% correct and working.\n\nPlease check your Spam folder if you did not see this in Inbox.'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log("❌ Email Send FAILED");
        console.log("Error:", error.message);
    } else {
        console.log("✅ Email Send SUCCESSFUL!");
        console.log("Response:", info.response);
        console.log("Check your inbox (and SPAM folder) for:", process.env.EMAIL_USER);
    }
});
