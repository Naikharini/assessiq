"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DashboardNavbar from "../../components/user/DashboardNavbar";
import DashboardSidebar from "../../components/user/DashboardSidebar";
export default function ResultPage() {
  const router = useRouter();
  const score = 1;
  const totalQuestions = 2;
  const percentage =
    totalQuestions > 0
      ? Math.round((score / totalQuestions) * 100)
      : 0;
  const results = [
    {
      id: 1,
      question: "What is the purpose of the useState hook in React?",
      options: [
        "To manage component lifecycle",
        "To manage state in functional components",
        "To handle side effects",
        "To create context providers",
      ],
      correctAnswer: "To manage state in functional components",
      userAnswer: null,
      explanation:
        "useState is a React Hook that lets you add state to functional components.",
    },
    {
      id: 2,
      question: "Which hook is used for side effects in React?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correctAnswer: "useEffect",
      userAnswer: null,
      explanation:
        "useEffect allows you to perform side effects such as API calls.",
    },
  ];
  const correctAnswers = results.filter(
    (item) => item.userAnswer === item.correctAnswer
  ).length;
  const unanswered = results.filter(
    (item) => !item.userAnswer
  ).length;
  const incorrectAnswers =
    results.length - correctAnswers - unanswered;
  return (
    <>
    <div className="min-h-screen bg-white ">
      <DashboardNavbar />
     <div className="max-w-7xl mx-auto flex gap-6 px-4 py-6">
        <DashboardSidebar />
        {/* Main Content */}
        <main className="flex-1 bg-white p-8">
          {/* Score Card */}
          <div className="bg-blue-50 border rounded-xl p-10 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-3xl">
              🏅
            </div>
            <h2 className="text-4xl text-black font-bold mt-4">
              Assessment Complete!
            </h2>
            <p className="text-6xl font-bold text-amber-500 mt-4">
              {percentage}%
            </p>
            <p className="mt-2 text-lg text-gray-600 font-medium">
              {percentage >= 50 ? "Great Job 🎉" : "Keep Practicing 💪"}
            </p>
            <p className="text-gray-600">
              You scored {score} out of {totalQuestions}
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <Link href="/user/dashboard">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                  Back to Dashboard
                </button>
              </Link>
              <Link href="/user/assessment">
                <button className="border px-6 py-3 text-gray-800 rounded-lg hover:bg-gray-100">
                  Take Another Test
                </button>
              </Link>
            </div>
          </div>
          {/* Detailed Results */}
          <div className="mt-8">
            <h3 className="text-3xl text-black font-semibold mb-6">
              Detailed Results
            </h3>
            {results.map((item) => (
              <div
                key={item.id}
                className="bg-white border text-gray-500 rounded-xl p-6 mb-6 shadow-sm"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-red-500 text-lg">❌</span>
                  <h4 className="font-semibold text-lg text-black">
                    Question {item.id}: {item.question}
                  </h4>
                </div>
                <div className="space-y-3">
                  {item.options.map((option, index) => {
                    const isCorrect =
                      option === item.correctAnswer;
                    return (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 flex justify-between items-center ${
                          isCorrect
                            ? "bg-green-50 border-green-500"
                            : "bg-white"
                        }`}
                      >
                        <span>{option}</span>
                        {isCorrect && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
                            Correct Answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {!item.userAnswer && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-lg">
                    You did not answer this question
                  </div>
                )}
                <div className="mt-4 bg-sky-50 border border-sky-200 p-4 rounded-lg">
                  <p className="font-medium text-sky-700">
                    Explanation:
                  </p>
                  <p className="text-gray-700 mt-1">
                    {item.explanation}
                  </p>
                </div>
              </div>
            ))}
            {/* Performance Summary */}
            <div className="mt-10 bg-white border rounded-xl p-6 shadow-sm">
              <h3 className="text-2xl text-black font-semibold mb-6">
                Performance Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-green-50 border rounded-lg">
                  <p className="text-3xl font-bold text-green-600">
                    {correctAnswers}
                  </p>
                  <p className="text-gray-700 mt-2">Correct Answers</p>
                </div>
                <div className="p-6 bg-red-50 border rounded-lg">
                  <p className="text-3xl font-bold text-red-600">
                    {incorrectAnswers}
                  </p>
                  <p className="text-gray-700 mt-2">Incorrect Answers</p>
                </div>
                <div className="p-6 bg-yellow-50 border rounded-lg">
                  <p className="text-3xl font-bold text-yellow-600">
                    {unanswered}
                  </p>
                  <p className="text-gray-700 mt-2">Unanswered</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
            </div>
    </>
  );
}