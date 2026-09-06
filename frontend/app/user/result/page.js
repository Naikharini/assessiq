"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardNavbar from "../../components/user/DashboardNavbar";
import DashboardSidebar from "../../components/user/DashboardSidebar";
import { useAuthGuard } from "../../lib/auth";

export default function ResultPage() {
  useAuthGuard("user");

  const [attempt, setAttempt] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("attemptResult");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setAttempt(parsed);
    setResults(parsed.details || []);
  }, []);

  if (!attempt) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">No results found. Take an assessment first.</p>
      </div>
    );
  }

  const correctAnswers = attempt.correctCount || 0;
  const totalQuestions = attempt.totalQuestions || results.length;
  const percentage = attempt.percentage || 0;
  const unanswered = results.filter((item) => !item.userAnswer).length;
  const incorrectAnswers = totalQuestions - correctAnswers - unanswered;

  return (
    <div className="min-h-screen mesh-content">
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto flex gap-6 px-4 py-6">
        <DashboardSidebar />

        <main className="flex-1 p-8">
          <div className="glass-score rounded-2xl p-10 text-center">
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
              {attempt.assessment?.skill ||
                attempt.Assessment?.skills ||
                attempt.assessment?.name ||
                attempt.Assessment?.name ||
                "Skill Assessment"}{" "}
              •{" "}
              {attempt.assessment?.topic ||
                attempt.Assessment?.topic ||
                "General"}{" "}
              •{" "}
              {attempt.assessment?.difficulty ||
                attempt.Assessment?.difficulty ||
                "Standard"}
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <Link href="/user/dashboard">
                <button className="glass-btn px-6 py-3 rounded-xl text-sm">
                  Back to Dashboard
                </button>
              </Link>

              <Link href="/user/assessment">
                <button className="glass-btn-outline px-6 py-3 rounded-xl text-sm">
                  Take Another Test
                </button>
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-3xl font-semibold mb-6 text-black">
              Detailed Results
            </h3>

            {results.map((item, index) => {
              const isCorrect = item.isCorrect;
              const isUnanswered = !item.userAnswer;

              return (
                <div
                  key={index}
                  className="glass-card rounded-2xl p-6 mb-6"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-xl">
                      {isUnanswered ? "⚠️" : isCorrect ? "✅" : "❌"}
                    </span>

                    <h4 className="font-semibold text-lg text-black">
                      Question {index + 1}: {item.question}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {item.options.map((option, optIndex) => {
                      const isCorrectOption =
                        option === item.correctAnswer;
                      const isUserChoice = option === item.userAnswer;

                      return (
                        <div
                          key={optIndex}
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

                  {isUnanswered && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-lg">
                      You did not answer this question
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 glass-strong rounded-2xl p-6">
            <h3 className="text-2xl font-semibold mb-6 text-black">
              Performance Summary
            </h3>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-6 glass-subtle rounded-xl border border-emerald-200/50">
                <p className="text-3xl font-bold text-green-600">
                  {correctAnswers}
                </p>
                <p className="text-green-600 font-medium">Correct</p>
              </div>

              <div className="p-6 glass-subtle rounded-xl border border-red-200/50">
                <p className="text-3xl font-bold text-red-600">
                  {incorrectAnswers}
                </p>
                <p className="text-red-600 font-medium">Incorrect</p>
              </div>

              <div className="p-6 glass-subtle rounded-xl border border-amber-200/50">
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
