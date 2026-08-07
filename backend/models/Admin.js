const bcrypt = require("bcryptjs");

// Temporary in-memory admin (later we move to DB)
const admin = {
  username: "admin",
  // password: admin123
  passwordHash: bcrypt.hashSync("admin123", 10)
};

module.exports = admin;
