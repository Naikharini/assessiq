"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import DashboardNavbar from "../../components/user/DashboardNavbar";
import DashboardSidebar from "../../components/user/DashboardSidebar";

export default function AssessmentPage() {
  const router = useRouter();

  const [skill, setSkill] = useState("React");
  const [topic, setTopic] = useState("Hooks");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [questionCount, setQuestionCount] = useState(10);

  const [loading, setLoading] = useState(false);

  const handleStartAssessment = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/assessment/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skill,
            topic,
            difficulty,
            questionCount,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to generate assessment");
        setLoading(false);
        return;
      }

    
      sessionStorage.setItem(
        "questions",
        JSON.stringify(data.questions)
      );

     
      sessionStorage.setItem(
        "assessment",
        JSON.stringify({
          skill,
          topic,
          difficulty,
          questionCount,
        })
      );

      router.push("/user/test");
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto flex gap-6 px-4 py-6">
        <DashboardSidebar />

        <div className="flex-1">

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black">
              Create New Assessment
            </h1>

            <p className="text-gray-600">
              Configure your AI-powered assessment
            </p>
          </div>

          <div className="bg-white rounded-2xl border p-6">

            {/* Skill */}

            <h2 className="font-semibold text-black mb-3">
              Select Skill
            </h2>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                "React",
                "JavaScript",
                "Python",
                "Java",
                "Node.js",
                "SQL",
                "C++",
                "Machine Learning",
                "DSA",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setSkill(item)}
                  className={`border border-gray-200 rounded-lg py-3 ${
                    skill === item
                      ? "bg-blue-500 text-white border border-blue-400"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Topic */}

            <h2 className="font-semibold text-black mb-3">
              Select Topic
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                "Hooks",
                "State Management",
                "Lifecycle",
                "Components",
                "OOP",
                "Data Structures",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setTopic(item)}
                  className={`border border-gray-200 rounded-lg py-3 ${
                    topic === item
                      ? "bg-blue-500 text-white border border-blue-400"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Difficulty */}

            <h2 className="font-semibold text-black mb-3">
              Difficulty
            </h2>

            <div className="flex gap-3 mb-6">
              {["Beginner", "Intermediate", "Advanced"].map((item) => (
                <button
                  key={item}
                  onClick={() => setDifficulty(item)}
                  className={`border border-gray-200 px-5 py-2 rounded-lg ${
                    difficulty === item
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Questions */}

            <h2 className="font-semibold text-black mb-3">
              Number of Questions
            </h2>

            <div className="flex gap-3 mb-6">
              {[5, 10, 15, 20].map((item) => (
                <button
                  key={item}
                  onClick={() => setQuestionCount(item)}
                  className={`border border-gray-200 px-5 py-2 rounded-lg ${
                    questionCount === item
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Preview */}

            <div className="bg-blue-50 rounded-xl p-5 mb-6">
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
            >
              {loading
                ? "Generating Questions..."
                : "Start Assessment"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}