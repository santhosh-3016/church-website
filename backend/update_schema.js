const db = require('./models/db');

const alterQuery = "ALTER TABLE appointments MODIFY COLUMN status ENUM('pending', 'approved', 'rejected', 'reschedule', 'cancelled') DEFAULT 'pending'";

db.query(alterQuery, (err, result) => {
    if (err) {
        console.error("Error updating schema:", err);
    } else {
        console.log("✅ Schema updated: Added 'cancelled' to status enum.");
    }
    process.exit();
});
