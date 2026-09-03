const db = require("../models");

const Assessment = db.Assessment;
const Question = db.Question;

const sanitizeDate = (val) => {
  if (!val || val === "Invalid date" || val === "" || val === "null" || val === "undefined") {
    return null;
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

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
      skills,
      topic,
      questions,
    } = req.body;

    const assessment = await Assessment.create({
      name,
      jobRole,
      department,
      difficulty,
      duration,
      passingScore,
      description,
      instructions,
      scheduleDate: sanitizeDate(scheduleDate),
      assignTo,
      skills: skills || jobRole,
      topic,
      createdBy: "admin",
      adminId: req.user?.id || null,
    });

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

exports.getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.findAll({
      include: [{ model: Question, as: "questions" }],
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

exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id, {
      include: [{ model: Question, as: "questions" }],
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

exports.getAssignedAssessments = async (req, res) => {
  try {
    const email = req.user.email;
    const { Op } = db.Sequelize;

    const assessments = await Assessment.findAll({
      where: {
        [Op.or]: [{ assignTo: email }, { userId: req.user.id }],
      },
      include: [{ model: Question, as: "questions" }],
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, assessments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCandidateStats = async (req, res) => {
  try {
    const attempts = await db.AssessmentAttempt.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Assessment,
          attributes: ["id", "name", "skills", "topic", "difficulty"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const total = attempts.length;
    const avg =
      total > 0
        ? Math.round(
            attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / total
          )
        : 0;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek = attempts.filter(
      (a) => new Date(a.createdAt) >= weekAgo
    ).length;

    return res.json({
      success: true,
      stats: {
        totalAssessments: total,
        averageScore: avg,
        thisWeek,
      },
      recentAttempts: attempts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id, {
      include: [{ model: Question, as: "questions" }],
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

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
      skills,
      topic,
      questions,
    } = req.body;

    await assessment.update({
      name,
      jobRole,
      department,
      difficulty,
      duration,
      passingScore,
      description,
      instructions,
      scheduleDate: sanitizeDate(scheduleDate),
      assignTo,
      skills: skills || jobRole,
      topic,
    });

    if (questions && Array.isArray(questions)) {
      await Question.destroy({ where: { assessmentId: assessment.id } });

      if (questions.length > 0) {
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
    }

    const updated = await Assessment.findByPk(assessment.id, {
      include: [{ model: Question, as: "questions" }],
    });

    return res.json({
      success: true,
      message: "Assessment updated successfully",
      assessment: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
