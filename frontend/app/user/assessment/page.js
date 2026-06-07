"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import DashboardNavbar from "../../components/user/DashboardNavbar";
import DashboardSidebar from "../../components/user/DashboardSidebar";

export default function AssessmentPage() {
  const router = useRouter();

  const [skill, setSkill] = useState("Python");
  const [topic, setTopic] = useState("Data Structures");
  const [level, setLevel] = useState("Beginner");
  const [questions, setQuestions] = useState(10);

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto flex gap-6 px-4 py-6">

        <DashboardSidebar />

        {/* MAIN */}
        <div className="flex-1">

          {/* TITLE */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black">
              Create New Assessment
            </h1>
            <p className="text-gray-700">
              Configure your AI-powered assessment
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white border rounded-2xl p-6">

            {/* SKILL */}
            <h2 className="font-semibold text-black mb-3">Select Skill *</h2>
            <div className="grid grid-cols-3 text-gray-400 gap-3 border-radius mb-6">
              {["JavaScript","Python","Java","C++","SQL","React","Node.js","ML","DSA","Algorithms"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSkill(s)}
                  className={`border px-3 py-2 rounded-lg ${
                    skill === s ? "bg-blue-100 border-blue-500 text-blue-900" : ""
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* TOPIC */}
            <h2 className="font-semibold text-black mb-3">Select Topic *</h2>
            <div className="grid grid-cols-2 text-gray-400 gap-3 mb-6">
              {["Data Structures","OOP","Decorators","Generators","File Handling"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`border px-3 py-2 rounded-lg ${
                    topic === t ? "bg-blue-100 border-blue-500 text-blue-900" : ""
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* LEVEL */}
            <h2 className="font-semibold text-black mb-3">Difficulty *</h2>
            <div className="flex gap-3 text-gray-400 mb-6">
              {["Beginner","Intermediate","Advanced"].map((d) => (
                <button
                  key={d}
                  onClick={() => setLevel(d)}
                  className={`border px-4 py-2 rounded-lg ${
                    level === d ? "bg-blue-100 border-blue-500 text-blue-900" : ""
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* QUESTIONS */}
            <h2 className="font-semibold text-black mb-3">Questions *</h2>
            <div className="flex gap-3 text-gray-400 mb-6">
              {[5,10,15,20].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuestions(q)}
                  className={`border px-4 py-2 rounded-lg ${
                    questions === q ? "bg-blue-100 border-blue-500 text-blue-900" : ""
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* PREVIEW */}
            <div className="bg-blue-50 p-4 text-gray-700 rounded-xl mb-6">
              <p><b>Skill:</b> {skill}</p>
              <p><b>Topic:</b> {topic}</p>
              <p><b>Difficulty:</b> {level}</p>
              <p><b>Questions:</b> {questions}</p>
            </div>

            {/* BUTTON */}
             <button
            onClick={() => router.push("/user/test")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl">
      Start Assessment →
    </button>

          </div>
        </div>
      </div>
    </div>
  );
}