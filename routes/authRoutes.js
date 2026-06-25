const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");

const router = express.Router();
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);
/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, password, role, state } = req.body;

    // 1. check if user exists
    const existingUser = await pool.query(
      "SELECT * FROM profiles WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 2. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. insert user
    const result = await pool.query(
      `INSERT INTO profiles
      (id, full_name, email, password, role, state)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        uuidv4(),
        full_name,
        email,
        hashedPassword,
        role || "citizen",
        state,
      ]
    );

    const user = result.rows[0];
    const { password: _, ...userWithoutPassword } = user;

   res.status(201).json({
  message: "User registered successfully",
  user: userWithoutPassword,
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   LOGIN (JWT)
========================= */
/* =========================
   LOGIN (JWT)
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM profiles WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

  const { password: _, ...userWithoutPassword } = user;

console.log("GENERATED TOKEN:", token);
console.log("TOKEN PARTS:", token.split(".").length);

res.json({
  message: "Login successful",
  token,
  user: userWithoutPassword,
});

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
router.post("/google-login", async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const full_name = payload.name;

    let userResult = await pool.query(
      "SELECT * FROM profiles WHERE email=$1",
      [email]
    );

    let user;

    if (userResult.rows.length === 0) {
      const newUser = await pool.query(
        `
      INSERT INTO profiles
(id, full_name, email, role)
VALUES($1,$2,$3,$4)
RETURNING *
        `,
       [uuidv4(), full_name, email, "citizen"]
      );

      user = newUser.rows[0];
    } else {
      user = userResult.rows[0];
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Google authentication failed",
    });
  }
});
module.exports = router;