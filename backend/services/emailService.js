const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS?.replace(/\s+/g, '') // Automatically remove spaces from app password if present
    }
});

// Verify connection on startup
transporter.verify(function (error, success) {
    if (error) {
        console.log("❌ Email Connection Error:", error.message);
        if (error.responseCode === 535) {
            console.log("   -> Hint: Check EMAIL_USER and EMAIL_PASS in .env. Use App Password, not login password.");
        }
    } else {
        console.log("✅ Email Service Ready: Connection established successfully.");
    }
});

exports.sendConfirmationEmail = (toEmail, name, day, slot) => {
    console.log(`[DEBUG] sendConfirmationEmail called for: ${toEmail}`);
    if (!toEmail) {
        console.log('⚠️ No email provided for confirmation.');
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Appointment Request Received - Power Of Praise A.G Church',
        text: `Dear ${name},\n\nWe have received your request for a pastoral appointment on ${day} at ${slot}.\n\nYour request is currently PENDING approval. We will notify you once it is confirmed.\n\nYou can also check your status on our website using your phone number.\n\nBlessings,\nPower Of Praise A.G Church`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('❌ Error sending confirmation email:', error.message);
        } else {
            console.log('✅ Confirmation Email sent:', info.response);
        }
    });
};

exports.sendStatusUpdateEmail = (toEmail, name, status, adminResponse) => {
    if (!toEmail) return;

    const subject = status === 'approved'
        ? 'Appointment Confirmed - Power Of Praise A.G Church'
        : status === 'rejected'
            ? 'Appointment Update - Power Of Praise A.G Church'
            : 'Appointment Reschedule Request - Power Of Praise A.G Church';

    const text = `Dear ${name},\n\nYour appointment request status has been updated to: ${status.toUpperCase()}.\n\n${adminResponse ? `Message from Pastor: "${adminResponse}"\n\n` : ''}Blessings,\nPower Of Praise A.G Church`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('❌ Error sending status email:', error.message);
        } else {
            console.log('✅ Status Update Email sent:', info.response);
        }
    });
};

exports.sendAdminNotification = (appointmentDetails) => {
    const adminEmail = "judahgiftson08@gmail.com";
    const { id, name, phone, email, topic, message, day, slot } = appointmentDetails;

    // Base URL for the backend actions (assuming backend is reachable)
    // For local development, this needs to be localhost.
    // Ideally, use an environment variable for BASE_URL.
    // Using http://localhost:5000 for this context provided by user commands.
    const baseUrl = "http://localhost:5000/api/appointments/email-action";

    const approveLink = `${baseUrl}?id=${id}&status=approved`;
    const rejectLink = `${baseUrl}?id=${id}&status=rejected`;
    const rescheduleLink = `${baseUrl}?id=${id}&status=reschedule`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `New Appointment Request: ${name}`,
        html: `
            <h2>New Appointment Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email || 'N/A'}</p>
            <p><strong>Topic:</strong> ${topic}</p>
            <p><strong>Requested Time:</strong> ${day} at ${slot}</p>
            <p><strong>Message:</strong> ${message || 'None'}</p>
            
            <hr />
            
            <h3>Quick Actions:</h3>
            <p>
                <a href="${approveLink}" style="background-color: green; color: white; padding: 10px 15px; text-decoration: none; margin-right: 10px;">Approve</a>
                <a href="${rejectLink}" style="background-color: red; color: white; padding: 10px 15px; text-decoration: none; margin-right: 10px;">Reject</a>
                <a href="${rescheduleLink}" style="background-color: orange; color: white; padding: 10px 15px; text-decoration: none;">Reschedule</a>
            </p>
            <p><small>(Clicking these calls the action immediately)</small></p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('❌ Error sending admin notification:', error.message);
        } else {
            console.log('✅ Admin Notification Sent:', info.response);
        }
    });
};
