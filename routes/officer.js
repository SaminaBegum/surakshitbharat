const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/auth");

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const officerId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM complaints
      WHERE assigned_officer_id = $1
      ORDER BY created_at DESC
      `,
      [officerId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;