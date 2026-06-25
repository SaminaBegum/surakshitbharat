const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
// CREATE COMPLAINT
router.post(
  "/",
  authMiddleware,
  upload.array("evidence", 5),
  async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      state,
      district,
      station,
      location,
      urgency,
    } = req.body;
const evidenceUrls = req.files
  ? req.files.map(file => file.path)
  : [];
    const complaintId = "SB-" + Date.now();

    const result = await pool.query(
  `
  INSERT INTO complaints
  (
    complaint_no,
    user_id,
    title,
    category,
    description,
    state,
    district,
    station,
    location,
    urgency,
    evidence_urls,
    status,
    ai_risk
  )
  VALUES
  ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
  RETURNING *
  `,
  [
    complaintId,
    req.user.id,
    title,
    category,
    description,
    state,
    district,
    station,
    location,
    urgency,
    evidenceUrls,
    "Submitted",
    Math.floor(Math.random() * 100),
  ]
);

    res.status(201).json({
      message: "Complaint submitted",
      complaint: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// GET ALL COMPLAINTS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM complaints
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// GET SINGLE COMPLAINT
router.get("/:complaintNo", authMiddleware, async (req, res) => {
  try {
    const { complaintNo } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM complaints
      WHERE complaint_no = $1
      `,
      [complaintNo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// UPDATE COMPLAINT STATUS
router.put("/:complaintNo/status", authMiddleware, async (req, res) => {
  try {
    const { complaintNo } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `
      UPDATE complaints
      SET status = $1
      WHERE complaint_no = $2
      RETURNING *
      `,
      [status, complaintNo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.json({
      message: "Status updated successfully",
      complaint: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});
// ASSIGN OFFICER TO COMPLAINT
// ASSIGN OFFICER TO COMPLAINT
router.put(
  "/:complaintNo/assign",
  authMiddleware,
  async (req, res) => {
    try {
      const { complaintNo } = req.params;

      const {
        assignedOfficer,
        assignedOfficerId
      } = req.body;
console.log("ASSIGN BODY:", req.body);
      const result = await pool.query(
        `
        UPDATE complaints
        SET assigned_officer = $1,
            assigned_officer_id = $2,
            status = 'Assigned'
        WHERE complaint_no = $3
        RETURNING *
        `,
        [
          assignedOfficer,
          assignedOfficerId,
          complaintNo
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Complaint not found",
        });
      }

      res.json({
        message: "Officer assigned successfully",
        complaint: result.rows[0],
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

module.exports = router;
// GET OFFICER CASES
router.get(
  "/officer/:officerId",
  authMiddleware,
  async (req, res) => {
    try {
      const { officerId } = req.params;

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
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

module.exports = router;
// ASSIGN OFFICER TO COMPLAINT
