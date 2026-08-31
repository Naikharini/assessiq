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

    setQuestions(JSON.parse(storedQuestions || "[]"));
    setAssessment(JSON.parse(storedAssessment || "{}"));
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
  }, []);

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
      <div className="h-screen flex items-center justify-center">
        Loading Assessment...
      </div>
    );
  }

  const q = questions[current];
  const answeredCount = Object.keys(answers).length;
  const progress =
    questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen mesh-content">
      <div className="glass-nav sticky top-0 z-40 flex justify-between items-center px-6 py-3">
        <Image src="/Logo.png" alt="logo" width={140} height={50} />

        <div className="flex items-center gap-4">
          <span
            className={`font-semibold ${timeLeft < 60 ? "text-red-600 animate-pulse" : ""}`}
          >
            ⏱ {formatTime(timeLeft)}
          </span>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="glass-btn px-4 py-2 rounded-xl text-sm disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-2 text-gray-600 text-sm">
          {assessment?.skill} • {assessment?.topic} • {assessment?.difficulty}
        </div>

        <h2 className="font-semibold text-black">
          Question {current + 1} of {questions.length}
        </h2>

        <div className="w-full glass-subtle h-2 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-gray-500 mt-2">
          {answeredCount} of {questions.length} answered
        </p>

        <div className="glass-strong p-8 mt-6 rounded-2xl">
          <h3 className="text-lg font-medium mb-4 text-gray-700">
            {q.question}
          </h3>

          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <label
                key={i}
                className={`flex items-center gap-3 glass-option p-3 rounded-xl cursor-pointer
                  ${answers[current] === opt ? "glass-option-selected" : ""}`}
              >
                <input
                  type="radio"
                  name={`q-${current}`}
                  checked={answers[current] === opt}
                  onChange={() => handleOption(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={prev}
            disabled={current === 0}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition
              ${
                current === 0
                  ? "glass-subtle text-slate-400 cursor-not-allowed"
                  : "glass-btn-outline"
              }
            `}
          >
            Previous
          </button>

          {current === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-sm font-medium bg-emerald-500/90 text-white hover:bg-emerald-600 disabled:opacity-60 backdrop-blur"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          ) : (
            <button
              onClick={next}
              className="px-5 py-2 rounded-xl text-sm font-medium glass-btn"
            >
              Next
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-10 h-10 rounded-xl transition text-sm font-medium
                ${
                  current === i
                    ? "glass-active"
                    : answers[i] !== undefined
                      ? "glass-subtle border-emerald-400/50 text-emerald-600"
                      : "glass-subtle text-slate-600"
                }
              `}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
