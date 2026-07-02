const express = require("express");
const router = express.Router();

const { generateAssessment } = require("../controllers/claudeAiController");

router.post("/generate", generateAssessment);

module.exports = router;