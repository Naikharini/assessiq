import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen mesh-content">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <span className="inline-block px-4 py-1.5 text-sm glass-badge rounded-full text-indigo-700 font-medium">
          AI-Powered Assessment Platform
        </span>

        <h1 className="mt-6 text-5xl font-bold text-slate-900 leading-tight">
          Welcome to AssessIQ MCQ
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Assessment System
          </span>
        </h1>

        <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg">
          Generate AI-based quizzes and tests in seconds. Choose your role to
          get started.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <div className="glass-card rounded-2xl p-8 text-left cursor-pointer">
            <div className="w-12 h-12 rounded-xl glass-subtle flex items-center justify-center text-2xl">
              🎯
            </div>
            <h2 className="text-2xl font-semibold mt-6 text-slate-900">User</h2>
            <p className="text-slate-600 mt-4">
              Take AI-powered assessments, track your progress, and improve your
              skills across various topics and difficulty levels.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li>• Create custom assessments</li>
              <li>• Track your performance</li>
              <li>• View detailed results</li>
            </ul>
            <Link
              href="/user"
              className="inline-flex items-center mt-8 text-blue-600 font-semibold hover:text-indigo-600 transition"
            >
              Get Started →
            </Link>
          </div>

          <div className="glass-card rounded-2xl p-8 text-left cursor-pointer">
            <div className="w-12 h-12 rounded-xl glass-subtle flex items-center justify-center text-2xl">
              📊
            </div>
            <h2 className="text-2xl font-semibold mt-6 text-slate-900">Admin</h2>
            <p className="text-slate-600 mt-4">
              Monitor platform activity, manage user assessments, view analytics,
              and oversee the entire assessment system.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li>• View all user assessments</li>
              <li>• Manage and edit tests</li>
              <li>• Monitor platform analytics</li>
            </ul>
            <Link
              href="/admin"
              className="inline-flex items-center mt-8 text-blue-600 font-semibold hover:text-indigo-600 transition"
            >
              Access Admin Panel →
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="glass-banner rounded-3xl p-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-slate-900">
                Why AssessIQ?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    n: "1",
                    title: "AI-Powered Questions",
                    desc: "Generate intelligent questions tailored to your skill level and topic.",
                  },
                  {
                    n: "2",
                    title: "Real-time Evaluation",
                    desc: "Get instant feedback with detailed explanations for every question.",
                  },
                  {
                    n: "3",
                    title: "Progress Tracking",
                    desc: "Monitor your growth through detailed analytics and reports.",
                  },
                ].map((item) => (
                  <div key={item.n} className="flex gap-4">
                    <div className="w-9 h-9 glass-strong rounded-xl flex items-center justify-center text-sm font-bold text-indigo-600 shrink-0">
                      {item.n}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl overflow-hidden p-1">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                alt="AI Assessment"
                className="rounded-xl w-full h-[320px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
