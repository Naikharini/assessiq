"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TestPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}:${s < 10 ? "0" : ""}${s}`;
  };
  useEffect(() => {
    const data = [
      {
        question: "What is the purpose of useState in React?",
        options: [
          "To manage component lifecycle",
          "To manage state in functional components",
          "To handle side effects",
          "To create context providers",
        ],
      },
      {
        question: "What is JSX?",
        options: [
          "JavaScript XML",
          "Java Syntax Extension",
          "JSON Format",
          "Java Server Executor",
        ],
      },
    ];

    setQuestions(data);
  }, []);

  const handleOption = (value) => {
    setAnswers({ ...answers, [current]: value });
  };

  const next = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };
  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    router.push("/user/result");
  };

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading AI Questions...
      </div>
    );
  }
  const q = questions[current];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* TOP BAR */}
      <div className="flex justify-between items-center px-6 py-3 bg-white shadow">

        <Image
          src="/Logo.png"
          alt="logo"
          width={150}
          height={60}
        />

        <div className="flex gap-4 items-center">

          {/* TIMER */}
          <span
            className={`text-sm text-black font-semibold ${
              timeLeft < 60 ? "text-red-600 animate-pulse" : ""
            }`}
          >
            ⏱ {formatTime(timeLeft)}
          </span>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Submit Test
          </button>

        </div>
      </div>

      {/* BODY */}
      <div className="max-w-4xl mx-auto p-6">

        {/* QUESTION HEADER */}
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-black">
            Question {current + 1} of {questions.length}
          </h2>

          <button className="border px-3 py-1 rounded-lg text-gray-600">
            🚩 Flag for Review
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-gray-200 h-2 rounded-full mt-3">
          <div
            className="bg-blue-500  h-2 rounded-full"
            style={{
              width: `${((current + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        {/* QUESTION BOX */}
        <div className="bg-white p-10 mt-6 rounded-2xl shadow-md border">

          <h3 className="font-medium text-gray-600 text-lg mb-4">
            {q.question}
          </h3>

          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <label
                key={i}
                className="flex items-center gap-3 border text-gray-400 p-3 rounded-lg cursor-pointer hover:bg-sky-100"
              >
                <input
                  type="radio"
                  name="option"
                  checked={answers[current] === opt}
                  onChange={() => handleOption(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prev}
            className="px-4 py-2 border rounded-lg"
          >
            Previous
          </button>

          <button
            onClick={next}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Next
          </button>
        </div>

        {/* QUESTION NAV */}
        <div className="mt-6 flex gap-2 flex-wrap">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-10 h-10 border rounded-lg ${
                current === i ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}