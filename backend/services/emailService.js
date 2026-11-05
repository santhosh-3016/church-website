const nodemailer = require('nodemailer');
const ipHelper = require('./ipHelper');
require('dotenv').config();

// Helper to auto-correct common email domain typos (e.g. gamil.com -> gmail.com)
const fixTypoEmail = (email) => {
    if (!email) return email;
    return email
        .trim()
        .replace(/@gamil\.com$/i, '@gmail.com')
        .replace(/@gmai\.com$/i, '@gmail.com')
        .replace(/@gmial\.com$/i, '@gmail.com')
        .replace(/@yaho\.com$/i, '@yahoo.com')
        .replace(/@hotmai\.com$/i, '@hotmail.com');
};

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
    const cleanEmail = fixTypoEmail(toEmail);
    console.log(`[DEBUG] sendConfirmationEmail called for: '${cleanEmail}'`);
    if (!cleanEmail) {
        console.log('⚠️ No email provided for client confirmation.');
        return;
    }

    const mailOptions = {
        from: `Power Of Praise A.G Church <${process.env.EMAIL_USER}>`,
        to: cleanEmail,
        subject: 'Appointment Request Received - Power Of Praise A.G Church',
        text: `Dear ${name},\n\nWe have received your request for a pastoral appointment on ${day} at ${slot}.\n\nYour request is currently PENDING approval. We will notify you once it is confirmed.\n\nBlessings,\nPower Of Praise A.G Church`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 10px;">
                <h2 style="color: #0B1B3D; text-align: center;">Power Of Praise A.G Church</h2>
                <h3 style="color: #0284C7; text-align: center;">Appointment Request Received</h3>
                <p>Dear <strong>${name}</strong>,</p>
                <p>Thank you for reaching out to us. We have received your request for a pastoral appointment.</p>
                <div style="background-color: #F8FAFC; padding: 15px; border-left: 4px solid #0284C7; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${day}</p>
                    <p style="margin: 5px 0;"><strong>Time Slot:</strong> ${slot}</p>
                    <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #D97706; font-weight: bold;">PENDING APPROVAL</span></p>
                </div>
                <p>Our pastoral team will review your request and confirm shortly. You can also check your appointment status on our website using your phone number.</p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
                <p style="text-align: center; color: #64748B; font-size: 12px;">Power Of Praise A.G Church &bull; Ramanatham, Tholuthur, Tamil Nadu</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('❌ Error sending confirmation email:', error.message);
        } else {
            console.log('✅ Confirmation Email sent successfully:', info.response);
        }
    });
};

exports.sendStatusUpdateEmail = (toEmail, name, status, adminResponse) => {
    const cleanEmail = fixTypoEmail(toEmail);
    if (!cleanEmail) return;

    const statusUpper = status.toUpperCase();
    const statusColor = status === 'approved' ? '#16A34A' : status === 'rejected' ? '#DC2626' : '#D97706';

    const subject = status === 'approved'
        ? 'Appointment Confirmed - Power Of Praise A.G Church'
        : status === 'rejected'
            ? 'Appointment Update - Power Of Praise A.G Church'
            : 'Appointment Reschedule Request - Power Of Praise A.G Church';

    const mailOptions = {
        from: `Power Of Praise A.G Church <${process.env.EMAIL_USER}>`,
        to: cleanEmail,
        subject: subject,
        text: `Dear ${name},\n\nYour appointment request status has been updated to: ${statusUpper}.\n\n${adminResponse ? `Message from Pastor: "${adminResponse}"\n\n` : ''}Blessings,\nPower Of Praise A.G Church`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0;">
                <h2 style="color: #0B1B3D; text-align: center;">Power Of Praise A.G Church</h2>
                <h3 style="color: ${statusColor}; text-align: center;">Appointment Status: ${statusUpper}</h3>
                <p>Dear <strong>${name}</strong>,</p>
                <p>Your appointment request status has been updated:</p>
                <div style="background-color: #F8FAFC; padding: 15px; border-left: 4px solid ${statusColor}; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusUpper}</span></p>
                    ${adminResponse ? `<p style="margin: 10px 0 5px 0;"><strong>Message from Pastor:</strong> "${adminResponse}"</p>` : ''}
                </div>
                <p>If you have any questions or need to make changes, please contact us at +91 99444 79364.</p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
                <p style="text-align: center; color: #64748B; font-size: 12px;">Power Of Praise A.G Church</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('❌ Error sending status email:', error.message);
        } else {
            console.log('✅ Status Update Email sent successfully:', info.response);
        }
    });
};

exports.sendAdminNotification = (appointmentDetails, req = null) => {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || "santhosh030126@gmail.com";
    const { id, name, phone, email, topic, message, day, slot, status, isCancellation } = appointmentDetails;

    console.log(`[DEBUG] Sending Admin Notification to: '${adminEmail}'`);

    const baseUrl = ipHelper.getBaseUrl(req);

    const approveLink = `${baseUrl}?id=${id}&status=approved`;
    const rejectLink = `${baseUrl}?id=${id}&status=rejected`;
    const rescheduleLink = `${baseUrl}?id=${id}&status=reschedule`;

    const subject = isCancellation
        ? `⚠️ Appointment CANCELLED by Client: ${name}`
        : `📅 New Appointment Request: ${name} (${day})`;

    const mailOptions = {
        from: `Church Booking System <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: subject,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #CBD5E1; border-radius: 8px;">
                <h2 style="color: #0B1B3D; margin-top: 0;">${isCancellation ? '⚠️ Appointment Cancelled' : '📅 New Pastoral Appointment Request'}</h2>
                <div style="background-color: #F1F5F9; padding: 15px; border-radius: 6px; margin: 15px 0;">
                    <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                    <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${email || 'Not provided'}</p>
                    <p style="margin: 5px 0;"><strong>Topic:</strong> ${topic}</p>
                    <p style="margin: 5px 0;"><strong>Requested Time:</strong> ${day} at ${slot}</p>
                    ${message ? `<p style="margin: 5px 0;"><strong>Message/Notes:</strong> "${message}"</p>` : ''}
                </div>
                
                ${!isCancellation ? `
                <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                <h3 style="color: #0F172A; margin-bottom: 10px;">Quick Admin Actions:</h3>
                <p>
                    <a href="${approveLink}" style="background-color: #16A34A; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px; inline-block;">✅ Approve</a>
                    <a href="${rejectLink}" style="background-color: #DC2626; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px; inline-block;">❌ Reject</a>
                    <a href="${rescheduleLink}" style="background-color: #D97706; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; inline-block;">🔄 Reschedule</a>
                </p>
                <p style="color: #64748B; font-size: 12px; margin-top: 15px;">Clicking an action button above will immediately update the status and notify the client.</p>
                ` : ''}
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('❌ Error sending admin notification email:', error.message);
        } else {
            console.log('✅ Admin Notification Email sent successfully:', info.response);
        }
    });
};
