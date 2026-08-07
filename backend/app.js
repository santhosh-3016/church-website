const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Pentecostal Church Backend Running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const sermonsRoutes = require("./routes/sermonsRoutes");
app.use("/api/sermons", sermonsRoutes);

const appointmentRoutes = require("./routes/appointmentRoutes");
app.use("/api/appointments", appointmentRoutes);

const membersRoutes = require("./routes/membersRoutes");
app.use("/api/members", membersRoutes);

const donationsRoutes = require("./routes/donationsRoutes");
app.use("/api/donations", donationsRoutes);


