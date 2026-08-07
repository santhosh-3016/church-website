const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const admin = require("../models/Admin");

const JWT_SECRET = "church_secret_key"; // later move to .env

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (username !== admin.username) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = bcrypt.compareSync(password, admin.passwordHash);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin" },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
};
