const db = require("../models");
const { dbToFrontendQuestions } = require("../utils/questionMapper");

const Assessment = db.Assessment;
const Question = db.Question;
const AssessmentAttempt = db.AssessmentAttempt;
const User = db.User;

const normalize = (str) => String(str || "").trim().toLowerCase();

const scoreAnswers = (questions, answers) => {
  let correctCount = 0;

  const details = questions.map((q, index) => {
    const options = [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean);
    const correctIndex = ["A", "B", "C", "D"].indexOf(q.correct);
    const correctAnswer = correctIndex >= 0 ? options[correctIndex] : options[0];
    const userAnswer = answers[index] ?? answers[String(index)] ?? null;
    const isCorrect = normalize(userAnswer) === normalize(correctAnswer);

    if (isCorrect) correctCount += 1;

    return {
      question: q.question,
      options,
      correctAnswer,
      userAnswer,
      isCorrect,
    };
  });

  const totalQuestions = questions.length;
  const percentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return { correctCount, totalQuestions, percentage, details };
};

exports.submitAttempt = async (req, res) => {
  try {
    const { assessmentId, answers } = req.body;
    const userId = req.user.id;

    const assessment = await Assessment.findByPk(assessmentId, {
      include: [{ model: Question, as: "questions" }],
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    // Schedule date enforcement
    if (assessment.scheduleDate && new Date(assessment.scheduleDate).getTime() > Date.now()) {
      return res.status(403).json({
        success: false,
        message: `This assessment is scheduled to start on ${new Date(assessment.scheduleDate).toLocaleString()}.`,
      });
    }

    const questions = assessment.questions || [];
    const result = scoreAnswers(questions, answers || {});

    const attempt = await AssessmentAttempt.create({
      userId,
      assessmentId,
      answers,
      score: result.percentage,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      percentage: result.percentage,
      status: "completed",
      completedAt: new Date(),
    });

    const user = await User.findByPk(userId, {
      attributes: ["id", "fullName", "email"],
    });

    return res.status(201).json({
      success: true,
      attempt: {
        id: attempt.id,
        score: attempt.score,
        correctCount: attempt.correctCount,
        totalQuestions: attempt.totalQuestions,
        percentage: attempt.percentage,
        details: result.details,
        assessment: {
          id: assessment.id,
          name: assessment.name,
          skill: assessment.skills || assessment.jobRole,
          topic: assessment.topic,
          difficulty: assessment.difficulty,
          duration: assessment.duration,
        },
        user,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyAttempts = async (req, res) => {
  try {
    const attempts = await AssessmentAttempt.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Assessment,
          attributes: ["id", "name", "skills", "topic", "difficulty", "passingScore", "duration"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, attempts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllAttempts = async (req, res) => {
  try {
    const attempts = await AssessmentAttempt.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "email"],
        },
        {
          model: Assessment,
          attributes: ["id", "name", "skills", "topic", "difficulty", "passingScore", "duration"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, attempts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAttemptById = async (req, res) => {
  try {
    const attempt = await AssessmentAttempt.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "email"],
        },
        {
          model: Assessment,
          include: [{ model: Question, as: "questions" }],
        },
      ],
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    const assessment = attempt.Assessment;
    const questions = assessment?.questions || [];
    const result = scoreAnswers(questions, attempt.answers || {});

    return res.json({
      success: true,
      attempt: {
        ...attempt.toJSON(),
        details: result.details,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAssessmentForTest = async (req, res) => {
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

    // Check if scheduled in future for non-admin candidate
    if (req.user?.role !== "admin" && assessment.scheduleDate) {
      const scheduledTime = new Date(assessment.scheduleDate).getTime();
      const now = Date.now();
      if (scheduledTime > now) {
        return res.status(403).json({
          success: false,
          message: `This assessment is scheduled for ${new Date(assessment.scheduleDate).toLocaleString()}. Please wait until the scheduled start time.`,
        });
      }
    }

    const questions = assessment.questions || [];

    return res.json({
      success: true,
      assessment: {
        id: assessment.id,
        name: assessment.name,
        skill: assessment.skills || assessment.jobRole,
        topic: assessment.topic,
        difficulty: assessment.difficulty,
        duration: assessment.duration,
        scheduleDate: assessment.scheduleDate,
      },
      questions: dbToFrontendQuestions(questions),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
