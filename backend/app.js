const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Pentecostal Church Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} (Listening on 0.0.0.0 for all network interfaces)`);
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

const livestreamRoutes = require("./routes/livestreamRoutes");
app.use("/api/livestream", livestreamRoutes);



