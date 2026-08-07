const db = require('../models/db');
const crypto = require('crypto');

let Razorpay = null;
try {
  Razorpay = require('razorpay');
} catch (e) {
  console.log("Razorpay SDK optional module loaded");
}

const getRazorpayInstance = () => {
  if (Razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return null;
};

// Create Order / Generate Transaction Reference
exports.createOrder = async (req, res) => {
  try {
    const { amount, category, donor_name, donor_email } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }

    const rzp = getRazorpayInstance();

    if (rzp) {
      const options = {
        amount: Math.round(parseFloat(amount) * 100), // amount in paise
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: {
          category: category || "General Offering",
          donor_name: donor_name || "",
          donor_email: donor_email || ""
        }
      };

      const order = await rzp.orders.create(options);
      return res.status(200).json({
        success: true,
        order_id: order.id,
        key_id: process.env.RAZORPAY_KEY_ID,
        amount: parseFloat(amount),
        currency: "INR",
        category: category || "General Offering",
        donor_name: donor_name || "",
        donor_email: donor_email || "",
        is_test_mode: false
      });
    }

    // Fallback Simulation Mode (When Razorpay API keys are not in backend/.env)
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const transactionId = `GIVE_${Date.now()}_${randomSuffix}`;

    return res.status(200).json({
      success: true,
      transaction_id: transactionId,
      amount: parseFloat(amount),
      currency: "INR",
      category: category || "General Offering",
      donor_name: donor_name || "",
      donor_email: donor_email || "",
      is_test_mode: true
    });
  } catch (error) {
    console.error("Error creating donation order:", error);
    return res.status(500).json({ success: false, message: "Failed to create donation order" });
  }
};

// Record Completed Payment & Verify Signature
exports.verifyPayment = (req, res) => {
  const {
    transaction_id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    donor_name,
    donor_email,
    donor_phone,
    amount,
    category,
    payment_method,
    notes
  } = req.body;

  // Razorpay Signature Verification
  if (razorpay_order_id && razorpay_payment_id && razorpay_signature && process.env.RAZORPAY_KEY_SECRET) {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid Razorpay payment signature" });
    }
  }

  const finalTransactionId = razorpay_payment_id || transaction_id;

  if (!finalTransactionId || !donor_name || !donor_email || !amount) {
    return res.status(400).json({
      success: false,
      message: "Missing required donation fields"
    });
  }

  const query = `
    INSERT INTO donations (donor_name, donor_email, donor_phone, amount, category, payment_method, transaction_id, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', ?)
  `;

  const values = [
    donor_name,
    donor_email,
    donor_phone || '',
    parseFloat(amount),
    category || 'General Offering',
    payment_method || 'Online Gateway',
    finalTransactionId,
    notes || ''
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database error saving donation:", err);
      return res.status(500).json({ success: false, message: "Failed to record donation" });
    }

    return res.status(201).json({
      success: true,
      message: "Giving payment processed and recorded successfully!",
      receipt: {
        receipt_no: `RCPT-${result.insertId}`,
        id: result.insertId,
        donor_name,
        donor_email,
        donor_phone,
        amount: parseFloat(amount),
        category: category || 'General Offering',
        payment_method: payment_method || 'Online Gateway',
        transaction_id: finalTransactionId,
        status: 'completed',
        date: new Date().toISOString()
      }
    });
  });
};

// Admin: Get all donations with optional category filter
exports.getAllDonations = (req, res) => {
  const { category, search } = req.query;
  let query = `SELECT * FROM donations WHERE 1=1`;
  const queryParams = [];

  if (category && category !== 'All') {
    query += ` AND category = ?`;
    queryParams.push(category);
  }

  if (search) {
    query += ` AND (donor_name LIKE ? OR donor_email LIKE ? OR transaction_id LIKE ?)`;
    const searchPattern = `%${search}%`;
    queryParams.push(searchPattern, searchPattern, searchPattern);
  }

  query += ` ORDER BY created_at DESC`;

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching donations:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch donations" });
    }
    return res.status(200).json({ success: true, donations: results });
  });
};

// Admin: Get Giving Statistics & Analytics
exports.getDonationStats = (req, res) => {
  const totalQuery = `SELECT SUM(amount) as total_amount, COUNT(*) as total_count FROM donations WHERE status = 'completed'`;
  const categoryQuery = `SELECT category, SUM(amount) as total, COUNT(*) as count FROM donations WHERE status = 'completed' GROUP BY category`;
  const recentQuery = `SELECT * FROM donations WHERE status = 'completed' ORDER BY created_at DESC LIMIT 5`;

  db.query(totalQuery, (err, totalResult) => {
    if (err) {
      console.error("Error fetching total donation stats:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch stats" });
    }

    db.query(categoryQuery, (err2, categoryResults) => {
      if (err2) {
        console.error("Error fetching category stats:", err2);
        return res.status(500).json({ success: false, message: "Failed to fetch stats" });
      }

      db.query(recentQuery, (err3, recentResults) => {
        if (err3) {
          console.error("Error fetching recent donations:", err3);
          return res.status(500).json({ success: false, message: "Failed to fetch stats" });
        }

        return res.status(200).json({
          success: true,
          stats: {
            total_amount: totalResult[0]?.total_amount || 0,
            total_count: totalResult[0]?.total_count || 0,
            by_category: categoryResults || [],
            recent_donations: recentResults || []
          }
        });
      });
    });
  });
};
