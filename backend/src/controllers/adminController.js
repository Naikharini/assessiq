const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { Admin, User, Assessment, Question, AssessmentAttempt } = db;

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({
      where: { email },
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();

    const admin = await Admin.findOne({
      where: { email },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.profile = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findByPk(decoded.id, {
      attributes: ["id", "name", "email"],
    });

    return res.json({
      success: true,
      admin,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalAssessments = await Assessment.count();
    const totalCandidates = await User.count();
    const totalQuestions = await Question.count();

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

    const totalAttempts = attempts.length;

    let avgScore = 0;
    let passedCount = 0;
    const uniqueCandidateIds = new Set();
    const assessmentAttemptCounts = {};
    const assessmentScores = {};

    attempts.forEach((a) => {
      const pct = Number(a.percentage) || 0;
      avgScore += pct;
      uniqueCandidateIds.add(a.userId);

      const passThreshold = a.Assessment?.passingScore ?? 70;
      if (pct >= passThreshold) {
        passedCount++;
      }

      const assessName = a.Assessment?.name || "Unknown";
      assessmentAttemptCounts[assessName] = (assessmentAttemptCounts[assessName] || 0) + 1;
      if (!assessmentScores[assessName]) {
        assessmentScores[assessName] = [];
      }
      assessmentScores[assessName].push(pct);
    });

    const averageScore = totalAttempts > 0 ? Math.round(avgScore / totalAttempts) : 0;
    const passRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;
    const activeCandidates = uniqueCandidateIds.size;
    const completionRate = totalAttempts > 0 ? 100 : 0;

    let mostAttempted = "None";
    let maxAttempts = 0;
    Object.entries(assessmentAttemptCounts).forEach(([name, count]) => {
      if (count > maxAttempts) {
        maxAttempts = count;
        mostAttempted = `${name} (${count} attempts)`;
      }
    });

    let highestScoring = "None";
    let maxAvg = -1;
    let lowestScoring = "None";
    let minAvg = 999;
    Object.entries(assessmentScores).forEach(([name, scores]) => {
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      if (avg > maxAvg) {
        maxAvg = avg;
        highestScoring = `${name} (avg ${avg}%)`;
      }
      if (avg < minAvg) {
        minAvg = avg;
        lowestScoring = `${name} (avg ${avg}%)`;
      }
    });

    const scoreBuckets = {
      "0-20%": 0,
      "21-40%": 0,
      "41-60%": 0,
      "61-80%": 0,
      "81-100%": 0,
    };
    attempts.forEach((a) => {
      const p = Number(a.percentage) || 0;
      if (p <= 20) scoreBuckets["0-20%"]++;
      else if (p <= 40) scoreBuckets["21-40%"]++;
      else if (p <= 60) scoreBuckets["41-60%"]++;
      else if (p <= 80) scoreBuckets["61-80%"]++;
      else scoreBuckets["81-100%"]++;
    });
    const scoreData = Object.entries(scoreBuckets).map(([range, count]) => ({
      range,
      count,
    }));

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      const dateStr = d.toISOString().split("T")[0];
      last7Days.push({ day: dayName, dateStr, count: 0 });
    }

    attempts.forEach((a) => {
      const attemptDate = new Date(a.createdAt).toISOString().split("T")[0];
      const match = last7Days.find((d) => d.dateStr === attemptDate);
      if (match) {
        match.count++;
      }
    });

    const activityData = last7Days.map((d) => ({
      day: d.day,
      MCQ: d.count,
    }));

    const recentActivity = attempts.slice(0, 10).map((a) => {
      const passThreshold = a.Assessment?.passingScore ?? 70;
      const isPassed = (Number(a.percentage) || 0) >= passThreshold;
      const dt = new Date(a.createdAt);
      const timeStr = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const dateStr = dt.toLocaleDateString([], { month: "short", day: "numeric" });

      return {
        id: a.id,
        candidate: a.User?.fullName || a.User?.email || "Anonymous",
        assessment: a.Assessment?.name || "Assessment",
        difficulty: a.Assessment?.difficulty || "Medium",
        score: a.percentage ?? a.score ?? 0,
        pct: `${a.percentage || 0}%`,
        time: `${a.Assessment?.duration || 45} min`,
        completed: `${dateStr}, ${timeStr}`,
        status: isPassed ? "Passed" : "Failed",
      };
    });

    return res.json({
      success: true,
      stats: {
        totalAssessments,
        totalCandidates,
        totalAttempts,
        totalQuestions,
        averageScore,
        passRate,
        activeCandidates,
        completionRate,
      },
      performance: {
        mostAttempted: mostAttempted !== "None" ? mostAttempted : "—",
        highestScoring: highestScoring !== "None" ? highestScoring : "—",
        lowestScoring: lowestScoring !== "None" ? lowestScoring : "—",
        completionRate: `${completionRate}%`,
      },
      candidateEngagement: {
        totalCandidates,
        activeCandidates,
        avgAssessmentsPerCandidate:
          totalCandidates > 0 ? (totalAttempts / totalCandidates).toFixed(1) : "0",
      },
      activityData,
      scoreData,
      recentActivity,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
