const db = require('./models/db');

const alterQuery = `
ALTER TABLE sermons
ADD COLUMN thumbnail VARCHAR(255) DEFAULT NULL;
`;

db.query(alterQuery, (err, result) => {
    if (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("Column 'thumbnail' already exists.");
        } else {
            console.error("Error altering table:", err);
        }
    } else {
        console.log("Sermons table altered successfully!");
    }
    process.exit();
});
