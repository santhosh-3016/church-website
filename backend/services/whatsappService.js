require('dotenv').config();

// Helper to format Indian / International phone numbers to pure digits (e.g. 919944479364)
const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    let cleaned = phone.replace(/\D/g, ''); // strip non-digits
    
    // If 10 digits (standard Indian mobile), prepend 91
    if (cleaned.length === 10) {
        cleaned = "91" + cleaned;
    }
    return cleaned;
};

/**
 * Generate a pre-filled WhatsApp Web / App link for sending messages directly
 */
const generateWhatsAppLink = (phone, message) => {
    const formattedPhone = formatPhoneNumber(phone);
    const encodedMsg = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMsg}`;
};

/**
 * Build personalized response messages for clients
 */
const buildClientMessage = (name, status, day, slot, adminResponse = "") => {
    const statusUpper = status ? status.toUpperCase() : "UPDATED";
    
    let msg = `Peace be unto you, ${name}!\n\n`;
    
    if (status === 'approved') {
        msg += `Your appointment with Senior Pastor has been APPROVED.\n\nDate: ${day}\nTime: ${slot}\n`;
    } else if (status === 'rejected') {
        msg += `Regrettably, your appointment request for ${day} at ${slot} could not be confirmed.\n`;
    } else if (status === 'reschedule') {
        msg += `Pastor has requested to RESCHEDULE your appointment (${day} at ${slot}).\n`;
    } else {
        msg += `Your appointment status is currently: ${statusUpper}.\n`;
    }

    if (adminResponse) {
        msg += `\nPastor's Note: "${adminResponse}"\n`;
    }

    msg += `\nBlessings,\nPower Of Praise A.G. Church\nRamanatham, Tholuthur`;
    return msg;
};

/**
 * Build Pastor WhatsApp action message with quick Approve/Reject/Reschedule links
 */
const buildAdminActionMessage = (id, name, phone, topic, day, slot, message = "", baseUrl = "http://localhost:5000/api/appointments/email-action") => {
    let msg = `*New Pastoral Appointment Request*\n\n`;
    msg += `Name: ${name}\n`;
    msg += `Phone: ${phone}\n`;
    msg += `Topic: ${topic}\n`;
    msg += `Requested Time: ${day} at ${slot}\n`;
    if (message) {
        msg += `Note: "${message}"\n`;
    }

    msg += `\n*Pastor Quick Action Links:*\n`;
    msg += `Approve: ${baseUrl}?id=${id}&status=approved\n`;
    msg += `Reject: ${baseUrl}?id=${id}&status=rejected\n`;
    msg += `Reschedule: ${baseUrl}?id=${id}&status=reschedule\n`;

    return msg;
};

/**
 * Automated WhatsApp Sending via Twilio (Optional - activates if credentials in .env)
 */
const sendAutomatedWhatsApp = async (phone, message) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

    if (!accountSid || !authToken) {
        console.log("ℹ️ Automated Twilio WhatsApp not configured. (Use WhatsApp Click-to-Chat links instead)");
        return { success: false, reason: "Twilio credentials not in .env" };
    }

    try {
        const client = require('twilio')(accountSid, authToken);
        const toWhatsApp = `whatsapp:+${formatPhoneNumber(phone)}`;

        const response = await client.messages.create({
            from: fromWhatsApp,
            to: toWhatsApp,
            body: message
        });

        console.log("✅ Automated WhatsApp Sent via Twilio:", response.sid);
        return { success: true, sid: response.sid };
    } catch (err) {
        console.error("❌ Error sending automated WhatsApp:", err.message);
        return { success: false, error: err.message };
    }
};

module.exports = {
    formatPhoneNumber,
    generateWhatsAppLink,
    buildClientMessage,
    buildAdminActionMessage,
    sendAutomatedWhatsApp
};
