// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({
//       message: "Access denied",
//     });
//   }

//   try {
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     req.user = decoded;
//     next();
//   } catch (error) {
//   console.error("JWT ERROR:", error.message);

//   return res.status(401).json({
//     message: "Invalid token",
//   });
// }
// };

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("AUTH HEADER:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied",
    });
  }

const token = authHeader.split(" ")[1];

console.log("TOKEN RAW:", JSON.stringify(token));
console.log("TOKEN PARTS:", token.split(".").length);

  if (!token || token.split(".").length !== 3) {
    return res.status(401).json({
      message: "Invalid token format",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};