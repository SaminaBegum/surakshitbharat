// const express = require("express");
// const cors = require("cors");
// const pool = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// require("dotenv").config();

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:8080",
//     credentials: true,
//   })
// );
// const userRoutes = require("./routes/userRoutes");
// app.use(express.json());
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.get("/", (req, res) => {
//   res.send("Surakshit Bharat API Running");
// });
// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   console.log(email); // OK
// });



// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const result = await pool.query(
//       "SELECT * FROM profiles WHERE email = $1",
//       [email]
//     );

//     const user = result.rows[0];

//     console.log("DB USER:", user); // ✅ OK here

//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // rest of login logic...
//   } catch (err) {
//     console.error(err);
//   }
// });

// app.post("/api/auth/login", async (req, res) => {
//   try {
//     // ✅ ALWAYS extract from req.body
//     const { email, password } = req.body;

//     const result = await pool.query(
//       "SELECT * FROM profiles WHERE email = $1",
//       [email]
//     );

//     const user = result.rows[0];

//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     res.json({
//       message: "Login successful",
//       user,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// });
// const bcrypt = require("bcrypt");

// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const result = await pool.query(
//       "SELECT * FROM profiles WHERE email = $1",
//       [email]
//     );

//     const user = result.rows[0];

//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     console.log("HASH CHECK OK"); // ✅ safe debug

//     res.json({
//       message: "Login successful",
//       user,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// });
// app.get("/test-db", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT NOW()");
//     res.json({
//       success: true,
//       databaseTime: result.rows[0],
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// });

// app.listen(process.env.PORT || 5000, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();
const complaintRoutes = require("./routes/complaintRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const officerRoutes = require("./routes/officerRoutes");
const sosRoutes = require("./routes/sos");
const quickReportRoutes = require("./routes/quickReport");
const app = express();


console.log("APP CREATED");



app.use(
  cors({
    origin: [
      "https://surakshitbharat-frontend.vercel.app",
      "http://localhost:5173",
      "http://localhost:8080"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/officers", officerRoutes);
app.use("/api/quick-report", quickReportRoutes);
// app.use("/api/officer", require("./routes/officer"));
console.log("Officer route registered");
// Home Route
app.get("/", (req, res) => {
  res.send("Surakshit Bharat API Running");
});

// DB Test Route
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      databaseTime: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
setInterval(() => {
  console.log("Server alive...");
}, 10000);
