const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  submitAttempt,
  getMyAttempts,
  getAllAttempts,
  getAttemptById,
  getAssessmentForTest,
} = require("../controllers/attemptController");

router.post("/submit", authMiddleware, requireRole("user"), submitAttempt);
router.get("/my", authMiddleware, requireRole("user"), getMyAttempts);
router.get("/all", authMiddleware, requireRole("admin"), getAllAttempts);
router.get("/assessment/:id", authMiddleware, getAssessmentForTest);
router.get("/:id", authMiddleware, getAttemptById);

module.exports = router;
