"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import DashboardNavbar from "../../components/user/DashboardNavbar";
import DashboardSidebar from "../../components/user/DashboardSidebar";
import { apiFetch } from "../../lib/api";
import { useAuthGuard } from "../../lib/auth";
import { SKILLS, getDefaultTopic, getTopicsForSkill } from "../../lib/skills";

export default function AssessmentPage() {
  const router = useRouter();
  useAuthGuard("user");

  const [skill, setSkill] = useState("React");
  const [topic, setTopic] = useState(getDefaultTopic("React"));
  const [difficulty, setDifficulty] = useState("Beginner");
  const [questionCount, setQuestionCount] = useState(3);
  const [loading, setLoading] = useState(false);

  const topics = getTopicsForSkill(skill);

  const handleSkillChange = (nextSkill) => {
    setSkill(nextSkill);
    setTopic(getDefaultTopic(nextSkill));
  };

  const handleStartAssessment = async () => {
    setLoading(true);

    try {
      const data = await apiFetch("/api/ai/generate-assessment", {
        method: "POST",
        body: JSON.stringify({
          skill,
          topic,
          difficulty,
          questionCount,
        }),
      });

      sessionStorage.setItem("questions", JSON.stringify(data.questions));
      sessionStorage.setItem(
        "assessment",
        JSON.stringify({
          id: data.assessment.id,
          skill: data.assessment.skill,
          topic: data.assessment.topic,
          difficulty: data.assessment.difficulty,
          questionCount: data.assessment.questionCount,
        })
      );

      router.push("/user/test");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to generate assessment");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen mesh-content">
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto flex gap-6 px-4 py-6">
        <DashboardSidebar />

        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">Create New Assessment</h1>
            <p className="text-slate-500 mt-1">
              Select your skills — AI will generate a short quiz (max 5 questions)
            </p>
          </div>

          <div className="glass-strong rounded-2xl p-6">
            <h2 className="font-semibold text-black mb-3">Select Skill</h2>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {SKILLS.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSkillChange(item)}
                  className={`glass-skill-btn rounded-xl py-3 text-sm font-medium ${
                    skill === item ? "glass-skill-btn-active" : "text-slate-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <h2 className="font-semibold text-black mb-3">Select Topic</h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {topics.map((item) => (
                <button
                  key={item}
                  onClick={() => setTopic(item)}
                  className={`glass-skill-btn rounded-xl py-3 text-sm font-medium ${
                    topic === item ? "glass-skill-btn-active" : "text-slate-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <h2 className="font-semibold text-black mb-3">Difficulty</h2>

            <div className="flex gap-3 mb-6">
              {["Beginner", "Intermediate", "Advanced"].map((item) => (
                <button
                  key={item}
                  onClick={() => setDifficulty(item)}
                  className={`glass-skill-btn px-5 py-2 rounded-xl text-sm font-medium ${
                    difficulty === item ? "glass-skill-btn-active" : "text-slate-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <h2 className="font-semibold text-black mb-3">
              Number of Questions (max 5)
            </h2>

            <div className="flex gap-3 mb-6">
              {[3, 4, 5].map((item) => (
                <button
                  key={item}
                  onClick={() => setQuestionCount(item)}
                  className={`glass-skill-btn px-5 py-2 rounded-xl text-sm font-medium ${
                    questionCount === item ? "glass-skill-btn-active" : "text-slate-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="glass-banner rounded-xl p-5 mb-6">
              <h2 className="font-semibold text-lg text-blue-700 mb-4">
                Assessment Preview
              </h2>
              <p className="text-gray-700">
                <strong>Skill:</strong> {skill}
              </p>
              <p className="text-gray-700">
                <strong>Topic:</strong> {topic}
              </p>
              <p className="text-gray-700">
                <strong>Difficulty:</strong> {difficulty}
              </p>
              <p className="text-gray-700">
                <strong>Questions:</strong> {questionCount}
              </p>
            </div>

            <button
              onClick={handleStartAssessment}
              disabled={loading}
              className="glass-btn px-8 py-3 rounded-xl disabled:opacity-60 font-medium"
            >
              {loading ? "Generating Questions..." : "Start Assessment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
