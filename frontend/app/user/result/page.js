"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardNavbar from "../../components/user/DashboardNavbar";
import DashboardSidebar from "../../components/user/DashboardSidebar";

export default function ResultPage() {
  const [results, setResults] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const normalize = (str) =>
    (str || "")
      .toString()
      .trim()
      .toLowerCase();

  const isCorrectAnswer = (userAnswer, correctAnswer) => {
    return normalize(userAnswer) === normalize(correctAnswer);
  };

  useEffect(() => {
    const storedQuestions = JSON.parse(
      sessionStorage.getItem("questions") || "[]"
    );

    const storedAnswers = JSON.parse(
      sessionStorage.getItem("answers") || "{}"
    );

    const storedAssessment = JSON.parse(
      sessionStorage.getItem("assessment") || "null"
    );

    if (!storedQuestions.length) return;

    const formatted = storedQuestions.map((q, index) => {
      const userAnswer = storedAnswers[index] || null;

      return {
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer,
        explanation: q.explanation || "No explanation provided",
      };
    });

    setResults(formatted);
    setAssessment(storedAssessment);
  }, []);


  const correctAnswers = results.filter((item) =>
    isCorrectAnswer(item.userAnswer, item.correctAnswer)
  ).length;

  const unanswered = results.filter((item) => !item.userAnswer).length;

  const incorrectAnswers = results.filter((item) => {
    return (
      item.userAnswer &&
      !isCorrectAnswer(item.userAnswer, item.correctAnswer)
    );
  }).length;

  const totalQuestions = results.length;

  const percentage =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-white">
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto flex gap-6 px-4 py-6">
        <DashboardSidebar />

        <main className="flex-1 bg-white p-8">

          {/* SCORE CARD */}
          <div className="bg-blue-50 border rounded-xl p-10 text-center">

            <h2 className="text-4xl font-bold text-black">
              Assessment Complete!
            </h2>

            <p className="text-6xl font-bold text-amber-500 mt-4">
              {percentage}%
            </p>

            <p className="mt-2 text-gray-600">
              You scored {correctAnswers} out of {totalQuestions}
            </p>

            <p className="text-gray-600 mt-2">
              {assessment?.skill} • {assessment?.topic} • {assessment?.difficulty}
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <Link href="/user/dashboard">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
                  Back to Dashboard
                </button>
              </Link>

              <Link href="/user/assessment">
                <button className="border  text-blue-600 px-6 py-3 rounded-lg">
                  Take Another Test
                </button>
              </Link>
            </div>
          </div>

          {/*DETAILED RESULTS */}
          <div className="mt-8">
            <h3 className="text-3xl font-semibold mb-6 text-black">
              Detailed Results
            </h3>

            {results.map((item) => {
              const isCorrect = isCorrectAnswer(
                item.userAnswer,
                item.correctAnswer
              );

              const isUnanswered = !item.userAnswer;

              return (
                <div
                  key={item.id}
                  className="border rounded-xl p-6 mb-6 shadow-sm"
                >

                  {/* QUESTION HEADER */}
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-xl">
                      {isUnanswered ? "⚠️" : isCorrect ? "✅" : "❌"}
                    </span>

                    <h4 className="font-semibold text-lg text-black">
                      Question {item.id}: {item.question}
                    </h4>
                  </div>

                  {/* OPTIONS */}
                  <div className="space-y-3">
                    {item.options.map((option, index) => {
                      const isCorrectOption = isCorrectAnswer(
                        option,
                        item.correctAnswer
                      );

                      const isUserChoice = isCorrectAnswer(
                        option,
                        item.userAnswer
                      );

                      return (
                        <div
                          key={index}
                          className={`border border-gray-200 text-gray-500 rounded-lg p-4 flex justify-between ${
                            isCorrectOption
                              ? "bg-green-50 border-green-500"
                              : isUserChoice && !isCorrectOption
                              ? "bg-red-50 border-red-400"
                              : "bg-white"
                          }`}
                        >
                          <span>{option}</span>

                          {isCorrectOption && (
                            <span className="text-green-600 text-sm font-medium">
                              Correct
                            </span>
                          )}

                          {isUserChoice && !isCorrectOption && (
                            <span className="text-red-500 text-sm font-medium">
                              Your Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* UNANSWERED */}
                  {isUnanswered && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-lg">
                      You did not answer this question
                    </div>
                  )}

                  {/* EXPLANATION */}
                  <div className="mt-4 bg-sky-50 border border-sky-200 p-4 rounded-lg">
                    <p className="font-medium text-sky-700">
                      Explanation:
                    </p>
                    <p className="text-gray-700 mt-1">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/*SUMMARY  */}
          <div className="mt-10 border rounded-xl p-6">
            <h3 className="text-2xl font-semibold mb-6 text-black">
              Performance Summary
            </h3>

            <div className="grid md:grid-cols-3 gap-6 text-center">

              <div className="p-6 bg-green-50 border rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {correctAnswers}
                </p>
                <p className="text-green-600 font-medium">Correct</p>
              </div>

              <div className="p-6 bg-red-50 border rounded-lg">
                <p className="text-3xl font-bold text-red-600">
                  {incorrectAnswers}
                </p>
                <p className="text-red-600 font-medium">Incorrect</p>
              </div>

              <div className="p-6 bg-yellow-50 border rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">
                  {unanswered}
                </p>
                <p className="text-yellow-600 font-medium">Unanswered</p>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}