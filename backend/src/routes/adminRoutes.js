const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  signup,
  login,
  profile,
  getDashboardStats,
} = require("../controllers/adminController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", profile);
router.get("/stats", authMiddleware, requireRole("admin"), getDashboardStats);

module.exports = router;
