import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <span className="inline-block px-4 py-1 text-sm bg-slate-100 rounded-full text-slate-600">
          AI-Powered Assessment Platform
        </span>
         <h1 className="mt-6 text-5xl font-bold text-slate-900">
          Welcome to AssessIQ MCQ
          <br />
          Assessment System
        </h1>
        <p className="mt-6 text-slate-600 max-w-2xl mx-auto">
          Generate AI-based quizzes and tests in seconds. Choose your role to
          get started.
        </p>
        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {/* User Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-left shadow-sm hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              🎯
            </div>
            <h2 className="text-2xl font-semibold mt-6 text-slate-900 text-color-black">
              I'm a User
            </h2>
            <p className="text-slate-600 mt-4">
              Take AI-powered assessments, track your progress,
              and improve your skills across various topics and
              difficulty levels.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li>• Create custom assessments</li>
              <li>• Track your performance</li>
              <li>• View detailed results</li>
            </ul>
            <Link
              href="/user"
              className="inline-flex items-center mt-8 text-blue-600 font-medium"
            >
              Get Started →
            </Link>
          </div>
          {/* Admin Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-left shadow-sm hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              📊
            </div>
            <h2 className="text-2xl font-semibold mt-6 text-slate-900 text-color-black">
              I'm an Admin
            </h2>
            <p className="text-slate-600 mt-4">
              Monitor platform activity, manage user assessments,
              view analytics, and oversee the entire assessment system.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li>• View all user assessments</li>
              <li>• Manage and edit tests</li>
              <li>• Monitor platform analytics</li>
            </ul>
            <Link
              href="/admin"
              className="inline-flex items-center mt-8 text-blue-600 font-medium"
            >
              Access Admin Panel →
            </Link>
          </div>
        </div>
      </section>
      {/* Why AssessIQ */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-blue-50 rounded-3xl p-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-slate-900 text-color-black">
                Why AssessIQ?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-300 rounded-lg flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-color-black">
                      AI-Powered Questions
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Generate intelligent questions tailored to
                      your skill level and topic.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-300 rounded-lg flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-color-black">
                      Real-time Evaluation
                    </h3>
                    <p className="text-slate-600 text-sm">
                       Get instant feedback with detailed explanations
                      for every question.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-300 rounded-lg flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-color-black">
                      Progress Tracking
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Monitor your growth through detailed
                      analytics and reports.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                alt="AI Assessment"
                className="rounded-2xl w-full h-[320px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}