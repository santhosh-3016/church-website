const db = require('./models/db');

const createDonationsTableQuery = `
CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_name VARCHAR(255) NOT NULL,
    donor_email VARCHAR(255) NOT NULL,
    donor_phone VARCHAR(50),
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) DEFAULT 'General Offering',
    payment_method VARCHAR(50) DEFAULT 'Online Gateway',
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('completed', 'pending', 'failed') DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

db.query(createDonationsTableQuery, (err, result) => {
    if (err) {
        console.error("Error creating donations table:", err);
    } else {
        console.log("Donations table ready!");
    }
    db.end();
    process.exit();
});
