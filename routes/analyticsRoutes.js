const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const total = await pool.query(
      "SELECT COUNT(*) FROM complaints"
    );

    const open = await pool.query(
      "SELECT COUNT(*) FROM complaints WHERE status != 'Closed'"
    );

    const closed = await pool.query(
      "SELECT COUNT(*) FROM complaints WHERE status = 'Closed'"
    );

    const highRisk = await pool.query(
      "SELECT COUNT(*) FROM complaints WHERE ai_risk >= 70"
    );

    res.json({
      total: Number(total.rows[0].count),
      open: Number(open.rows[0].count),
      closed: Number(closed.rows[0].count),
      highRisk: Number(highRisk.rows[0].count),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;