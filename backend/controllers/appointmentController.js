const db = require('../models/db');
const emailService = require('../services/emailService');
const whatsappService = require('../services/whatsappService');
const ipHelper = require('../services/ipHelper');

// Create new appointment
exports.createAppointment = (req, res) => {
    const { name, phone, email, topic, message, day, slot } = req.body;
    console.log(`[DEBUG] Received appointment request. Name: '${name}', Email: '${email}', Phone: '${phone}'`);

    // Basic validation
    if (!name || !phone || !topic || !day || !slot) {
        return res.status(400).json({ message: "Request incomplete. Missing requirement fields." });
    }

    // Check if slot is already taken
    const checkQuery = "SELECT * FROM appointments WHERE day = ? AND slot = ? AND status != 'rejected' AND status != 'reschedule'";
    db.query(checkQuery, [day, slot], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error checking slot" });

        if (results.length > 0) {
            return res.status(409).json({ message: "This time slot is already booked. Please choose another." });
        }

        // Insert new appointment
        const insertQuery = "INSERT INTO appointments (name, phone, email, topic, message, day, slot) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(insertQuery, [name, phone, email, topic, message, day, slot], (err, result) => {
            if (err) {
                console.error("Error inserting appointment:", err);
                return res.status(500).json({ message: "Failed to book appointment" });
            }

            // Send Confirmation Email to Client
            emailService.sendConfirmationEmail(email, name, day, slot);

            // Send Notification Email to Admin
            emailService.sendAdminNotification({
                id: result.insertId,
                name, phone, email, topic, message, day, slot
            }, req);

            // Generate WhatsApp message with Quick Action Links for church admin/pastor using local IP for mobile access
            const baseUrl = ipHelper.getBaseUrl(req);
            const adminWaMsg = whatsappService.buildAdminActionMessage(result.insertId, name, phone, topic, day, slot, message, baseUrl);
            const adminWaLink = whatsappService.generateWhatsAppLink("919025937253", adminWaMsg);

            res.status(201).json({
                message: "Appointment request submitted successfully",
                id: result.insertId,
                whatsapp_admin_link: adminWaLink
            });
        });
    });
};

// Get all appointments (Admin)
exports.getAllAppointments = (req, res) => {
    const query = "SELECT * FROM appointments ORDER BY created_at DESC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        
        // Attach WhatsApp direct links to each appointment object
        const enriched = results.map(apt => {
            const clientMsg = whatsappService.buildClientMessage(apt.name, apt.status, apt.day, apt.slot, apt.admin_response);
            return {
                ...apt,
                whatsapp_link: whatsappService.generateWhatsAppLink(apt.phone, clientMsg)
            };
        });
        
        res.json(enriched);
    });
};

// Update status (Approve, Reject, Reschedule, Cancelled)
exports.updateStatus = (req, res) => {
    const { id } = req.params;
    const { status, admin_response } = req.body;

    if (!['approved', 'rejected', 'reschedule', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    // First get the appointment
    const getQuery = "SELECT * FROM appointments WHERE id = ?";
    db.query(getQuery, [id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: "Appointment not found" });

        const appointment = results[0];

        const query = "UPDATE appointments SET status = ?, admin_response = ? WHERE id = ?";
        db.query(query, [status, admin_response || '', id], (err, result) => {
            if (err) return res.status(500).json({ message: "Failed to update status" });

            // Notify Client via Email
            emailService.sendStatusUpdateEmail(appointment.email, appointment.name, status, admin_response);

            // Generate WhatsApp response message and direct link
            const waMsg = whatsappService.buildClientMessage(appointment.name, status, appointment.day, appointment.slot, admin_response);
            const waLink = whatsappService.generateWhatsAppLink(appointment.phone, waMsg);

            // Attempt automated Twilio WhatsApp if configured
            whatsappService.sendAutomatedWhatsApp(appointment.phone, waMsg);

            res.json({
                message: `Appointment ${status} successfully`,
                whatsapp_link: waLink
            });
        });
    });
};

// Handle Email & WhatsApp Action (GET request from Pastor Email OR WhatsApp link)
exports.handleEmailAction = (req, res) => {
    const { id, status } = req.query;

    if (!id || !status || !['approved', 'rejected', 'reschedule', 'cancelled'].includes(status)) {
        return res.status(400).send("Invalid Request Parameters");
    }

    const getQuery = "SELECT * FROM appointments WHERE id = ?";
    db.query(getQuery, [id], (err, results) => {
        if (err || results.length === 0) return res.status(404).send("Appointment request not found");

        const appointment = results[0];

        // Update status
        const updateQuery = "UPDATE appointments SET status = ? WHERE id = ?";
        db.query(updateQuery, [status, id], (err, result) => {
            if (err) return res.status(500).send("Database Error");

            if (status === 'cancelled') {
                emailService.sendAdminNotification({
                    ...appointment,
                    status: 'cancelled',
                    isCancellation: true
                });
            } else {
                emailService.sendStatusUpdateEmail(appointment.email, appointment.name, status, "Updated via Pastor Action Link");
            }

            // Generate client WhatsApp link
            const clientMsg = whatsappService.buildClientMessage(appointment.name, status, appointment.day, appointment.slot);
            const clientWaLink = whatsappService.generateWhatsAppLink(appointment.phone, clientMsg);

            const statusColor = status === 'approved' ? '#16A34A' : status === 'rejected' ? '#DC2626' : status === 'cancelled' ? '#64748B' : '#D97706';

            // Return clean HTML success page
            res.send(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>Appointment Action - Power Of Praise A.G Church</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <style>
                            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #F8FAFC; color: #0F172A; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
                            .card { background: white; max-width: 500px; width: 100%; padding: 32px; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 1px solid #E2E8F0; text-align: center; }
                            .badge { inline-block; padding: 6px 16px; border-radius: 9999px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; background: ${statusColor}15; color: ${statusColor}; border: 1px solid ${statusColor}40; margin-bottom: 16px; }
                            h1 { color: #0B1B3D; margin: 0 0 12px 0; font-size: 24px; }
                            p { color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0; }
                            .details { background: #F1F5F9; border-radius: 12px; padding: 16px; text-align: left; font-size: 14px; margin-bottom: 24px; border: 1px solid #E2E8F0; }
                            .details p { margin: 4px 0; color: #334155; }
                            .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px 20px; border-radius: 10px; font-weight: 600; font-size: 14px; text-decoration: none; transition: all 0.2s; box-sizing: border-box; margin-bottom: 10px; }
                            .btn-whatsapp { background: #16A34A; color: white; }
                            .btn-whatsapp:hover { background: #15803D; }
                            .btn-dashboard { background: #0F172A; color: white; }
                            .btn-dashboard:hover { background: #1E293B; }
                        </style>
                    </head>
                    <body>
                        <div class="card">
                            <div class="badge">${status === 'cancelled' ? 'CANCELLED' : status.toUpperCase()}</div>
                            <h1>Appointment ${status === 'cancelled' ? 'Cancelled' : 'Updated Successfully'}</h1>
                            <p>Pastor action confirmed. The status for <strong>${appointment.name}</strong> has been updated to <strong>${status.toUpperCase()}</strong>.</p>
                            
                            <div class="details">
                                <p><strong>Client:</strong> ${appointment.name}</p>
                                <p><strong>Phone:</strong> ${appointment.phone}</p>
                                <p><strong>Requested Time:</strong> ${appointment.day} at ${appointment.slot}</p>
                                <p><strong>Topic:</strong> ${appointment.topic}</p>
                            </div>

                            <a href="${clientWaLink}" target="_blank" class="btn btn-whatsapp">
                                💬 Notify Client via WhatsApp
                            </a>
                            <a href="http://localhost:5173/admin/dashboard" class="btn btn-dashboard">
                                ← Return to Admin Dashboard
                            </a>
                        </div>
                    </body>
                </html>
            `);
        });
    });
};

// Check Status by Phone
exports.checkStatus = (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number required" });

    const query = "SELECT * FROM appointments WHERE phone = ? ORDER BY created_at DESC";
    db.query(query, [phone], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(results);
    });
};
