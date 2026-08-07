const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// Public
router.post("/", appointmentController.createAppointment);
router.post("/status", appointmentController.checkStatus);

// Email Action Route (Public GET, so it can be clicked from email)
router.get("/email-action", appointmentController.handleEmailAction);

// Admin (protected by frontend logic mostly, but we treat them as protected routes conceptually)
router.get("/", appointmentController.getAllAppointments);
router.put("/:id/status", appointmentController.updateStatus);

module.exports = router;
