const db = require('./models/db');

const createTableQuery = `
CREATE TABLE IF NOT EXISTS livestream_settings (
    id INT PRIMARY KEY DEFAULT 1,
    is_live TINYINT(1) NOT NULL DEFAULT 0,
    video_url VARCHAR(255) DEFAULT '',
    stream_title VARCHAR(255) DEFAULT 'Sunday Morning Divine Worship Service',
    stream_description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

const insertDefaultQuery = `
INSERT INTO livestream_settings (id, is_live, video_url, stream_title, stream_description)
VALUES (1, 0, '', 'Sunday Morning Divine Worship Service', 'Join us live for worship, prayer, and an inspiring sermon from the Word of God.')
ON DUPLICATE KEY UPDATE id=1;
`;

db.query(createTableQuery, (err, result) => {
    if (err) {
        console.error("Error creating livestream_settings table:", err);
        process.exit(1);
    }
    console.log("✅ livestream_settings table ready!");
    
    db.query(insertDefaultQuery, (err2, result2) => {
        if (err2) {
            console.error("Error inserting default livestream record:", err2);
        } else {
            console.log("✅ Default livestream setting initialized!");
        }
        process.exit();
    });
});
