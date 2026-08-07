const db = require('./models/db');

const createTableQuery = `
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    topic VARCHAR(255) NOT NULL,
    message TEXT,
    day VARCHAR(20) NOT NULL,
    slot VARCHAR(50) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'reschedule') DEFAULT 'pending',
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_booking (day, slot)
);
`;

db.query(createTableQuery, (err, result) => {
    if (err) {
        console.error("Error creating table:", err);
    } else {
        console.log("Appointments table ready!");
    }
    process.exit();
});
