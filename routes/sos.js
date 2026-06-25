const express = require("express");
const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    await pool.query(
      `
      INSERT INTO sos_alerts
      (id,citizen_id,latitude,longitude,status)
      VALUES($1,$2,$3,$4,$5)
      `,
      [
        uuidv4(),
        req.user.id,
        latitude,
        longitude,
        "pending",
      ]
    );

    res.json({
      success: true,
      message: "SOS Sent Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
/* ==========================
   GET SOS ALERTS
========================== */

router.get("/alerts", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        s.*,
        p.full_name
      FROM sos_alerts s
      JOIN profiles p
        ON s.citizen_id = p.id
      ORDER BY s.created_at DESC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;