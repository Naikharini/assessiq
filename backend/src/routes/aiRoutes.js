const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const aiController = require("../controllers/claudeAiController");

router.post(
  "/generate-assessment",
  authMiddleware,
  aiController.generateAssessment
);

router.post(
  "/generate",
  authMiddleware,
  aiController.generateQuestionsOnly
);

module.exports = router;
