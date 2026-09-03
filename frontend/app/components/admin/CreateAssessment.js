"use client";
import { useState } from "react";
import { Plus, Trash2, Save, Eye, Send, ChevronDown, Sparkles, ArrowLeft } from "lucide-react";
import { apiFetch } from "../../lib/api";
import { SKILLS, getDefaultTopic, getTopicsForSkill } from "../../lib/skills";

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Data Science",
  "Marketing",
  "Operations",
  "HR",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard", "Expert"];
const CORRECT_OPTIONS = ["A", "B", "C", "D"];

function emptyQuestion() {
  return {
    id: Date.now(),
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correct: "A",
    difficulty: "Easy",
    points: 5,
  };
}

export default function CreateAssessment({
  assessmentData = null,
  onBack,
} = {}) {
  const isEditMode = Boolean(assessmentData?.id);
  const [form, setForm] = useState(() => ({
    name: assessmentData?.name || "",
    jobRole: assessmentData?.jobRole || assessmentData?.skills || "",
    department: assessmentData?.department || "Engineering",
    difficulty: assessmentData?.difficulty || "Medium",
    duration: assessmentData?.duration || 45,
    passingScore: assessmentData?.passingScore || 70,
    description: assessmentData?.description || "",
    instructions: assessmentData?.instructions || "",
    scheduleDate: assessmentData?.scheduleDate || "",
    assignTo: assessmentData?.assignTo || "",
  }));

  const [questions, setQuestions] = useState(() => {
    if (assessmentData?.questions?.length) {
      return assessmentData.questions.map((q, i) => ({
        id: Date.now() + i,
        ...q,
      }));
    }
    return [emptyQuestion()];
  });

  const [activeQ, setActiveQ] = useState(0);
  const [published, setPublished] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const [aiSkill, setAiSkill] = useState("React");
  const [aiTopic, setAiTopic] = useState(getDefaultTopic("React"));
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleAiSkillChange = (nextSkill) => {
    setAiSkill(nextSkill);
    setAiTopic(getDefaultTopic(nextSkill));
  };
  const setQField = (idx, k, v) =>
    setQuestions((qs) =>
      qs.map((q, i) => (i === idx ? { ...q, [k]: v } : q))
    );
  const addQuestion = () => {
    const nq = emptyQuestion();
    setQuestions((qs) => [...qs, nq]);
    setActiveQ(questions.length);
  };
  const deleteQuestion = (idx) => {
    if (questions.length === 1) return;
    setQuestions((qs) => qs.filter((_, i) => i !== idx));
    setActiveQ(Math.max(0, idx - 1));
  };

  const handlePublish = async () => {
    if (!form.name) {
      alert("Please enter an assessment name.");
      return;
    }

    if (questions.some((q) => !q.question)) {
      alert("All questions must have text.");
      return;
    }

    setPublishing(true);
    try {
      if (isEditMode) {
        await apiFetch(
          `/api/assessment/${assessmentData.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              ...form,
              duration: Number(form.duration),
              passingScore: Number(form.passingScore),
              skills: form.jobRole,
              questions: questions.map(({ id, ...q }) => q),
            }),
          },
          "admin"
        );
        alert("Assessment updated successfully!");
        onBack?.();
      } else {
        await apiFetch(
          "/api/assessment/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...form,
              duration: Number(form.duration),
              passingScore: Number(form.passingScore),
              skills: form.jobRole,
              questions: questions.map(({ id, ...q }) => q),
            }),
          },
          "admin"
        );
        setPublished(true);
      }
    } catch (err) {
      alert(err.message || "Failed to save assessment");
    }
    setPublishing(false);
  };

  const handleGenerateAI = async () => {
    setGenerating(true);
    try {
      const data = await apiFetch(
        "/api/ai/generate",
        {
          method: "POST",
          body: JSON.stringify({
            skill: aiSkill,
            topic: aiTopic,
            difficulty: form.difficulty,
            questionCount: 3,
          }),
        },
        "admin"
      );

      const generated = (data.questions || []).map((q, i) => {
        const options = q.options || [];
        const correctIdx = options.findIndex(
          (opt) => opt === q.correctAnswer
        );
        const letters = ["A", "B", "C", "D"];

        return {
          id: Date.now() + i,
          question: q.question,
          optionA: options[0] || "",
          optionB: options[1] || "",
          optionC: options[2] || "",
          optionD: options[3] || "",
          correct: letters[correctIdx >= 0 ? correctIdx : 0],
          difficulty: form.difficulty,
          points: 5,
        };
      });

      if (generated.length) {
        setQuestions(generated);
        setActiveQ(0);
        if (!form.name) {
          setField("name", `${aiSkill} - ${aiTopic} Assessment`);
        }
        if (!form.jobRole) {
          setField("jobRole", aiSkill);
        }
      }
    } catch (err) {
      alert(err.message || "AI generation failed");
    }
    setGenerating(false);
  };

  const currentQ = questions[activeQ] || questions[0];

  if (published) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-2">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center p-4">
          <Send size={28} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          Assessment Published!
        </h2>
        <p className="text-slate-500 text-sm">
          "{form.name}" has been published successfully.
        </p>

        <button
          onClick={() => {
            setPublished(false);
            setForm({
              name: "",
              jobRole: "",
              department: "Engineering",
              difficulty: "Medium",
              duration: 45,
              passingScore: 70,
              description: "",
              instructions: "",
              scheduleDate: "",
              assignTo: "",
            });
            setQuestions([emptyQuestion()]);
            setActiveQ(0);
          }}
          className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Create Another Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-5">
      {/* Main form */}
      <div className="flex-1 min-w-0 space-y-5 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                title="Back to Manage Assessments"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                {isEditMode ? "Edit Assessment" : "Create AI Assessment"}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {isEditMode
                  ? `Editing: ${assessmentData?.name || ""}`
                  : "Build MCQ-based assessments for your candidates."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-5">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <Save size={14} /> Save Draft
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <Eye size={14} /> Preview
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              <Send size={14} />{" "}
              {publishing
                ? isEditMode
                  ? "Saving..."
                  : "Publishing..."
                : isEditMode
                ? "Save Changes"
                : "Publish"}
            </button>
          </div>
        </div>

        {/* Assessment Details card */}
        <div className="glass-strong rounded-xl gap-4 align-center p-5">
          <h2 className="text-sm font-semibold text-slate-700 mt-1 mb-4">
            Assessment Details
          </h2>
          <div className="grid grid-cols-2 gap-4 px-4 py-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Assessment Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="e.g. Senior React Engineer Screen"
                className="w-full px-3 py-2 text-sm text-gray-600 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Job Role
              </label>
              <input
                value={form.jobRole}
                onChange={(e) => setField("jobRole", e.target.value)}
                placeholder="Frontend Engineer"
                className="w-full px-3 py-2 text-sm text-gray-600 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Department
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDeptOpen(!deptOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white hover:bg-slate-50 focus:outline-none"
                >
                  <span className="text-slate-700">{form.department}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {deptOpen && (
                  <div className="absolute top-full mt-1 left-0 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                    {DEPARTMENTS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setField("department", d);
                          setDeptOpen(false);
                        }}
                        className={`block w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${
                          form.department === d
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Difficulty buttons */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Difficulty
              </label>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setField("difficulty", d)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                      form.difficulty === d
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-gray-600 hover:bg-slate-200"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min={1}
                value={form.duration}
                onChange={(e) => setField("duration", e.target.value)}
                className="w-full px-3 py-2 text-sm border text-gray-500 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Passing Score (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.passingScore}
                onChange={(e) => setField("passingScore", e.target.value)}
                className="w-full px-3 py-2 text-sm border text-gray-500 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* AI Generator */}
        <div className="glass-strong rounded-xl p-5 border border-blue-100/60 bg-gradient-to-r from-blue-50/40 via-white to-indigo-50/30">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-800">
                AI Question Generator
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Fast generation from predefined skills &amp; topics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Skill
              </label>
              <select
                value={aiSkill}
                onChange={(e) => handleAiSkillChange(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-600 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SKILLS.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Topic
              </label>
              <select
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-600 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {getTopicsForSkill(aiSkill).map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={generating}
              className="w-full py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              {generating ? "Generating..." : "Generate 3 Questions"}
            </button>
          </div>
        </div>

        {/* Question Builder */}
        <div className="glass-strong rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                {activeQ + 1}
              </span>
              <h2 className="text-sm font-semibold text-slate-700">
                Question {activeQ + 1} of {questions.length}
              </h2>
            </div>
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
            >
              <Plus size={13} /> Add Question
            </button>
          </div>

          {currentQ && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Question Text
                </label>
                <textarea
                  rows={3}
                  value={currentQ.question}
                  onChange={(e) =>
                    setQField(activeQ, "question", e.target.value)
                  }
                  placeholder="Enter your question here..."
                  className="w-full px-3 py-2 text-sm text-gray-600 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {["A", "B", "C", "D"].map((letter) => (
                  <div key={letter}>
                    <label className="block text-xs text-gray-500 mb-1">
                      Option {letter}
                    </label>
                    <input
                      value={currentQ[`option${letter}`] || ""}
                      onChange={(e) =>
                        setQField(
                          activeQ,
                          `option${letter}`,
                          e.target.value
                        )
                      }
                      placeholder={`Option ${letter}`}
                      className="w-full px-3 py-2 text-sm text-gray-600 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Correct Option
                  </label>
                  <select
                    value={currentQ.correct}
                    onChange={(e) =>
                      setQField(activeQ, "correct", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm text-gray-600 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CORRECT_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={currentQ.difficulty}
                    onChange={(e) =>
                      setQField(activeQ, "difficulty", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm text-gray-600 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Points
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={currentQ.points}
                    onChange={(e) =>
                      setQField(activeQ, "points", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 text-sm text-gray-600 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Questions list */}
        <div className="glass-strong text-gray-600 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-700 p-4 mt-2 align-center justify-content mb-3">
            Questions ({questions.length})
          </h2>
          <div className="space-y-2">
            {questions.map((q, i) => (
              <div
                key={q.id || i}
                onClick={() => setActiveQ(i)}
                className={`flex items-center text-gray-600 gap-3 px-4 align-center p-2 py-3 rounded-lg border cursor-pointer transition-all ${
                  activeQ === i
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-100 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex text-center text-gray-600 items-center justify-center text-xs font-bold shrink-0 ${
                    activeQ === i
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-gray-600"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                    MCQ
                  </p>
                  <p className="text-sm text-gray-700 truncate">
                    {q.question || "New question"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteQuestion(i);
                  }}
                  className="p-1.5 rounded hover:bg-red-50 justify-center items-center align-center text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-72 shrink-0 gap-4 align-center mt-4 p-2 mb-4 space-y-4">
        {/* Publish Settings */}
        <div className="glass-strong rounded-xl p-4">
          <h3 className="text-sm font-semibold mt-2 align-center p-3 text-gray-700 mb-3">
            Publish Settings
          </h3>
          <div className="space-y-3 px-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Schedule Assessment
              </label>
              <input
                type="datetime-local"
                value={form.scheduleDate}
                onChange={(e) => setField("scheduleDate", e.target.value)}
                className="w-full px-3 py-2 text-xs text-gray-600 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Assign To
              </label>
              <input
                value={form.assignTo}
                onChange={(e) => setField("assignTo", e.target.value)}
                placeholder="candidate@email.com"
                className="w-full px-3 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing}
              className="w-full py-2.5 mb-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {publishing
                ? isEditMode
                  ? "Saving..."
                  : "Publishing..."
                : isEditMode
                ? "Save Changes"
                : "Publish Assessment"}
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="glass-strong rounded-xl mt-2 mb-2 p-4">
          <h3 className="text-sm font-semibold mt-2 align-center p-3 text-slate-700 mb-3">
            Summary
          </h3>
          <div className="space-y-2 align-center gap-2 p-3 text-xs">
            {[
              ["Questions", questions.length],
              [
                "Total Points",
                questions.reduce(
                  (a, q) => a + (Number(q.points) || 0),
                  0
                ),
              ],
              ["Duration", `${form.duration} min`],
              ["Passing Score", `${form.passingScore}%`],
              ["Difficulty", form.difficulty],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-500">{k}</span>
                <span className="font-medium text-gray-700">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
