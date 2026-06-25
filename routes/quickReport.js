const express = require("express");
const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      category,
      description,
      media_url,
      latitude,
      longitude,
    } = req.body;

    await pool.query(
      `
      INSERT INTO quick_reports
      (
        id,
        citizen_id,
        category,
        description,
        media_url,
        latitude,
        longitude
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7)
      `,
      [
        uuidv4(),
        req.user.id,
        category,
        description,
        media_url,
        latitude,
        longitude,
      ]
    );

    res.json({
      success: true,
      message: "Quick Report Submitted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});
router.get(
  "/all",
  async (req, res) => {
    try {

      const result = await pool.query(
      `
      SELECT
        qr.*,
        p.full_name
      FROM quick_reports qr
      JOIN profiles p
        ON qr.citizen_id = p.id
      ORDER BY qr.created_at DESC
      `
      );

      res.json(result.rows);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:"Server Error"
      });

    }
  }
);
module.exports = router;