// const express = require("express");
// const {
//   getOfficers,
//   createOfficer,
// } = require("../controllers/officerController");

// const router = express.Router();
// console.log("Officer routes loaded");
// router.get("/", getOfficers);
// router.post("/", createOfficer);

// module.exports = router;
const express = require("express");
const router = express.Router();

const {
  getOfficers,
  createOfficer,
} = require("../controllers/officerController");

router.get("/", getOfficers);
router.post("/", createOfficer);

module.exports = router;