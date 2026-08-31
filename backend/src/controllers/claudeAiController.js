const db = require("../models");
const aiService = require("../services/aiService");
const {
  clampQuestionCount,
  aiToDbQuestions,
  dbToFrontendQuestions,
  MAX_QUESTIONS,
} = require("../utils/questionMapper");

const Assessment = db.Assessment;
const Question = db.Question;

const generateAssessment = async (req, res) => {
  try {
    const {
      skill,
      skills,
      topic,
      difficulty = "Beginner",
      questionCount,
      numberOfQuestions,
      save = true,
      name,
      assignTo,
    } = req.body;

    const skillValue = skill || (Array.isArray(skills) ? skills.join(", ") : skills);
    if (!skillValue) {
      return res.status(400).json({
        success: false,
        message: "Skill is required",
      });
    }

    const count = clampQuestionCount(questionCount || numberOfQuestions || 3);
    const aiResult = await aiService.generateQuestions(
      skillValue,
      topic || "",
      difficulty,
      count
    );

    const aiQuestions = aiResult.questions || [];
    if (!aiQuestions.length) {
      return res.status(500).json({
        success: false,
        message: "AI did not return questions",
      });
    }

    const dbQuestions = aiToDbQuestions(aiQuestions);

    if (!save) {
      return res.json({
        success: true,
        questions: aiQuestions,
      });
    }

    const assessment = await Assessment.create({
      name: name || `${skillValue} Assessment`,
      jobRole: skillValue,
      department: "General",
      difficulty,
      duration: count * 5,
      passingScore: 60,
      description: `AI-generated ${skillValue} assessment`,
      skills: skillValue,
      topic: topic || "",
      createdBy: req.user?.role === "admin" ? "admin" : "candidate",
      userId: req.user?.role === "user" ? req.user.id : null,
      adminId: req.user?.role === "admin" ? req.user.id : null,
      assignTo: assignTo || req.user?.email || "",
    });

    const questionRows = dbQuestions.map((q) => ({
      ...q,
      assessmentId: assessment.id,
    }));

    const savedQuestions = await Question.bulkCreate(questionRows);
    const frontendQuestions = dbToFrontendQuestions(savedQuestions);

    return res.status(201).json({
      success: true,
      assessment: {
        id: assessment.id,
        name: assessment.name,
        skill: skillValue,
        topic: topic || "",
        difficulty,
        questionCount: frontendQuestions.length,
      },
      questions: frontendQuestions,
    });
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }
};

const generateQuestionsOnly = async (req, res) => {
  req.body.save = false;
  return generateAssessment(req, res);
};

module.exports = {
  generateAssessment,
  generateQuestionsOnly,
  MAX_QUESTIONS,
};
