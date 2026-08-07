const express = require('express');
const router = express.Router();
const donationsController = require('../controllers/donationsController');

// Public routes for donors
router.post('/create-order', donationsController.createOrder);
router.post('/verify', donationsController.verifyPayment);

// Admin routes (used in Admin Dashboard)
router.get('/', donationsController.getAllDonations);
router.get('/stats', donationsController.getDonationStats);

module.exports = router;
