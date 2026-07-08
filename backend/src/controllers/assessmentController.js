const db = require("../models");

const Assessment = db.Assessment;
const Question = db.Question;

// ============================
// Create Assessment
// ============================
exports.createAssessment = async (req, res) => {
  try {
    const {
      name,
      jobRole,
      department,
      difficulty,
      duration,
      passingScore,
      description,
      instructions,
      scheduleDate,
      assignTo,
      questions,
    } = req.body;

    // Create Assessment
    const assessment = await Assessment.create({
      name,
      jobRole,
      department,
      difficulty,
      duration,
      passingScore,
      description,
      instructions,
      scheduleDate,
      assignTo,
    });

    // Create Questions
    if (questions && questions.length > 0) {
      const questionData = questions.map((q) => ({
        assessmentId: assessment.id,
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correct: q.correct,
        difficulty: q.difficulty,
        points: q.points,
      }));

      await Question.bulkCreate(questionData);
    }

    return res.status(201).json({
      success: true,
      message: "Assessment created successfully",
      assessment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get All Assessments

exports.getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.findAll({
      include: [Question],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      assessments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Assessment By Id

exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id, {
      include: [Question],
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    return res.json({
      success: true,
      assessment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete Assessment

exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    await assessment.destroy();

    return res.json({
      success: true,
      message: "Assessment deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};