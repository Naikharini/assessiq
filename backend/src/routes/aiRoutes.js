const express = require("express");
const router = express.Router();
const { generateMCQs } = require("../services/aiService");

router.post("/generate", async (req, res) => {
  try {
    const { skill, count, difficulty } = req.body;

    const questions = await generateMCQs({
      skill,
      count,
      difficulty,
    });

    res.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "AI generation failed",
    });
  }
});

module.exports = router;