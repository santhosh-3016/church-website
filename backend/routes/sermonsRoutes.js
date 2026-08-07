const express = require("express");
const router = express.Router();

const {
  getSermons,
  addSermon,
  deleteSermon,
  updateSermon
} = require("../controllers/sermonsController");

router.get("/", getSermons);
router.post("/", addSermon);
router.delete("/:id", deleteSermon);
router.put("/:id", updateSermon);

module.exports = router;
