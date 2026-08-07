const db = require('../models/db');
const emailService = require('../services/emailService');

// Create new appointment
exports.createAppointment = (req, res) => {
    const { name, phone, email, topic, message, day, slot } = req.body;
    console.log(`[DEBUG] Received appointment request. Email: '${email}'`);

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
            });

            res.status(201).json({ message: "Appointment request submitted successfully", id: result.insertId });
        });
    });
};

// Get all appointments (Admin)
exports.getAllAppointments = (req, res) => {
    const query = "SELECT * FROM appointments ORDER BY created_at DESC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(results);
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

            // If updated by Admin (via API usually means Admin), notify Client
            // BUT if status is 'cancelled' (usually means client cancelled), we normally notify admin?
            // Assuming this API endpoint is for ADMIN dashboard use:
            emailService.sendStatusUpdateEmail(appointment.email, appointment.name, status, admin_response);

            res.json({ message: `Appointment ${status} successfully` });
        });
    });
};

// Handle Email Action (GET request from Admin Email OR Client Email)
exports.handleEmailAction = (req, res) => {
    const { id, status } = req.query;

    if (!id || !status || !['approved', 'rejected', 'reschedule', 'cancelled'].includes(status)) {
        return res.status(400).send("Invalid Request");
    }

    const getQuery = "SELECT * FROM appointments WHERE id = ?";
    db.query(getQuery, [id], (err, results) => {
        if (err || results.length === 0) return res.status(404).send("Appointment not found");

        const appointment = results[0];

        // Update status
        const updateQuery = "UPDATE appointments SET status = ? WHERE id = ?";
        db.query(updateQuery, [status, id], (err, result) => {
            if (err) return res.status(500).send("Database Error");

            if (status === 'cancelled') {
                // Action came from CLIENT -> Notify ADMIN
                emailService.sendAdminNotification({
                    ...appointment,
                    status: 'cancelled',
                    isCancellation: true // Flag to distinguish email type
                });
            } else {
                // Action came from ADMIN -> Notify CLIENT
                emailService.sendStatusUpdateEmail(appointment.email, appointment.name, status, "Updated via Email Action");
            }

            // Return simple HTML success page
            res.send(`
                <html>
                    <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                        <h1 style="color: ${status === 'approved' ? 'green' : status === 'rejected' ? 'red' : status === 'cancelled' ? 'gray' : 'orange'};">
                            ${status === 'cancelled' ? 'Appointment Cancelled' : 'Action Successful!'}
                        </h1>
                        <p>
                            ${status === 'cancelled'
                    ? `Your appointment request has been cancelled.`
                    : `Appointment for <strong>${appointment.name}</strong> has been marked as <strong>${status.toUpperCase()}</strong>.`}
                        </p>
                        ${status !== 'cancelled' ? '<p>The client has been notified via email.</p>' : '<p>The administration has been notified.</p>'}
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
