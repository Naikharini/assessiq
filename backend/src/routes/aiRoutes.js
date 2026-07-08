const express = require("express");
const router = express.Router();

const aiController = require("../controllers/claudeAiController");

router.post("/generate", aiController.generateAssessment);

module.exports = router;