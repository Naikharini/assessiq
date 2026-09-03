"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch } from "../../lib/api";
import { useAuthGuard } from "../../lib/auth";

export default function TestPage() {
  const router = useRouter();
  useAuthGuard("user");

  const [questions, setQuestions] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const storedQuestions = sessionStorage.getItem("questions");
    const storedAssessment = sessionStorage.getItem("assessment");

    if (!storedQuestions) {
      router.push("/user/assessment");
      return;
    }

    const parsedQuestions = JSON.parse(storedQuestions || "[]");
    const parsedAssessment = JSON.parse(storedAssessment || "{}");

    setQuestions(parsedQuestions);
    setAssessment(parsedAssessment);

    if (parsedAssessment?.duration) {
      setTimeLeft(Number(parsedAssessment.duration) * 60);
    }
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [assessment, answers]);

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleOption = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [current]: value,
    }));
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting || !assessment?.id) return;
    setSubmitting(true);

    try {
      const data = await apiFetch("/api/attempts/submit", {
        method: "POST",
        body: JSON.stringify({
          assessmentId: assessment.id,
          answers,
        }),
      });

      sessionStorage.setItem("attemptResult", JSON.stringify(data.attempt));
      router.push("/user/result");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to submit assessment");
      setSubmitting(false);
    }
  };

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center mesh-content">
        <p className="text-slate-500">Loading test...</p>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="min-h-screen mesh-content">
      {/* Test header */}
      <header className="glass-nav sticky top-0 z-40 px-6 py-4 flex justify-between items-center bg-white border-b border-slate-200">
        <div>
          <h1 className="font-bold text-slate-800 text-lg">
            {assessment?.skill || assessment?.name || "Skill Assessment"}
          </h1>
          <p className="text-xs text-slate-500">
            {assessment?.topic ? `${assessment.topic} • ` : ""}{assessment?.difficulty} Level
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-mono text-sm font-semibold text-slate-700">
            ⏱ {formatTime(timeLeft)}
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="glass-btn px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Progress bar */}
        <div className="glass-strong rounded-xl p-4">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>
              Question {current + 1} of {questions.length}
            </span>
            <span>
              {Object.keys(answers).length} of {questions.length} Answered
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 transition-all duration-300 rounded-full"
              style={{
                width: `${((current + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-card rounded-2xl p-7 space-y-6 bg-white border border-slate-200">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              {current + 1}
            </span>
            <h2 className="text-lg font-medium text-slate-800 leading-relaxed">
              {q?.question}
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {(q?.options || [q?.optionA, q?.optionB, q?.optionC, q?.optionD].filter(Boolean)).map(
              (opt, i) => {
                const isSelected = answers[current] === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleOption(opt)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                      isSelected
                        ? "bg-blue-50 border-blue-500 text-blue-800 shadow-sm"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={prev}
            disabled={current === 0}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {current < questions.length - 1 ? (
            <button
              onClick={next}
              className="glass-btn px-6 py-2.5 rounded-xl text-sm font-medium"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="glass-btn px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Finish Test"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
