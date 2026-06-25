const pool = require("../config/db");

const getOfficers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM officers ORDER BY name`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch officers",
    });
  }
};

const createOfficer = async (req, res) => {
  try {
    const {
      name,
      badge_number,
      email,
      phone,
      designation,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO officers
      (name, badge_number, email, phone, designation)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        name,
        badge_number,
        email,
        phone,
        designation,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create officer",
    });
  }
};

module.exports = {
  getOfficers,
  createOfficer,
};