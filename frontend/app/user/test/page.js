"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TestPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [assessment, setAssessment] = useState(null);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  const [timeLeft, setTimeLeft] = useState(30 * 60);

  // ================= LOAD DATA =================
  useEffect(() => {
    const storedQuestions = sessionStorage.getItem("questions");
    const storedAssessment = sessionStorage.getItem("assessment");

    if (!storedQuestions) {
      router.push("/user/assessment");
      return;
    }

    setQuestions(JSON.parse(storedQuestions || "[]"));
    setAssessment(JSON.parse(storedAssessment || "{}"));
  }, []);

  // ================= TIMER =================
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

  // ================= FORMAT TIME =================
  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}:${s < 10 ? "0" : ""}${s}`;
  };

  // ================= ANSWER SELECT =================
  const handleOption = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [current]: value,
    }));
  };

  // ================= NAVIGATION =================
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

  // ================= SUBMIT =================
  const handleSubmit = () => {
    sessionStorage.setItem("answers", JSON.stringify(answers));
    sessionStorage.setItem("questions", JSON.stringify(questions));
    sessionStorage.setItem("assessment", JSON.stringify(assessment));

    router.push("/user/result");
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
    questions.length > 0
      ? (answeredCount / questions.length) * 100
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* TOP BAR */}
      <div className="flex justify-between items-center px-6 py-3 bg-white shadow">
        <Image src="/Logo.png" alt="logo" width={140} height={50} />

        <div className="flex items-center gap-4">
          <span className={`font-semibold ${timeLeft < 60 ? "text-red-600 animate-pulse" : ""}`}>
            ⏱ {formatTime(timeLeft)}
          </span>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>

      {/* HEADER */}
      <div className="max-w-4xl mx-auto p-6">

        <div className="mb-2 text-gray-600 text-sm">
          {assessment?.skill} • {assessment?.topic} • {assessment?.difficulty}
        </div>

        <h2 className="font-semibold text-black">
          Question {current + 1} of {questions.length}
        </h2>

        {/* PROGRESS BAR */}
        <div className="w-full bg-gray-200 h-2 rounded-full mt-3">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-gray-500 mt-2">
          {answeredCount} of {questions.length} answered
        </p>

        {/* QUESTION */}
        <div className="bg-white p-8 mt-6 rounded-xl shadow border">
          <h3 className="text-lg font-medium mb-4 text-gray-700">
            {q.question}
          </h3>

          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <label
                key={i}
                className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer transition
                  ${answers[current] === opt
                    ? "bg-blue-50 border-blue-500"
                    : "hover:bg-gray-50"
                  }`}
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

        {/* NAVIGATION */}
        <div className="flex justify-between items-center mt-6">

          <button
            onClick={prev}
            disabled={current === 0}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition
              ${current === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
              }
            `}
          >
            Previous
          </button>

          {current === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={next}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              Next
            </button>
          )}

        </div>

        {/* QUESTION NAV */}
        <div className="mt-6 flex flex-wrap gap-2">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-10 h-10 border rounded-lg transition
                ${current === i
                  ? "bg-blue-600 text-white"
                  : answers[i] !== undefined
                    ? "border-green-500 text-green-600"
                    : "text-gray-600"
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