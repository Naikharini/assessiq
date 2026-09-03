const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  deleteAssessment,
  updateAssessment,
  getAssignedAssessments,
  getCandidateStats,
} = require("../controllers/assessmentController");

router.post(
  "/create",
  authMiddleware,
  requireRole("admin"),
  createAssessment
);

router.get(
  "/all",
  authMiddleware,
  requireRole("admin"),
  getAllAssessments
);

router.get(
  "/assigned",
  authMiddleware,
  requireRole("user"),
  getAssignedAssessments
);

router.get(
  "/stats",
  authMiddleware,
  requireRole("user"),
  getCandidateStats
);

router.get("/:id", authMiddleware, getAssessmentById);

router.put(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  updateAssessment
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  deleteAssessment
);

module.exports = router;
