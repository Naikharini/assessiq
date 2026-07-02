const express = require("express");
const router = express.Router();

const {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  deleteAssessment,
} = require("../controllers/assessmentController");

router.post("/create", createAssessment);
router.get("/all", getAllAssessments);
router.get("/:id", getAssessmentById);
router.delete("/:id", deleteAssessment);

module.exports = router;