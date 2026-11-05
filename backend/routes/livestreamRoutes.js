const express = require("express");
const router = express.Router();
const {
  getLiveStreamStatus,
  updateLiveStreamStatus
} = require("../controllers/livestreamController");

router.get("/", getLiveStreamStatus);
router.post("/", updateLiveStreamStatus);

module.exports = router;
