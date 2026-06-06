 
"use client";
 
import { useRouter } from "next/navigation";
 
 
import Link from "next/link";
import {
  FileText,
  Clock,
  TrendingUp,
  BarChart3,
} from "lucide-react";
 
 
export default function Hero() {
  const router = useRouter();
 
  return (
    <section className="min-h-screen bg-slate-50 py-10">
 
      {/* Back to Home */}
      <div className="pl-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition"
        >
          ← Back to Home
        </Link>
      </div>
 
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 items-center">
 
        {/* Left Side */}
        <div>
          <span className="inline-block bg-blue-50 text-blue-600 text-sm px-4 py-2 rounded-full font-medium">
            For Students & Learners
          </span>
 
          <h1 className="mt-6 text-3xl lg:text-5xl font-bold text-slate-900 leading-tight">
            Test Your Knowledge
            <br />
            with AI-Powered
            <br />
            Assessments
          </h1>
 
          <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
            Create custom MCQ tests across multiple skills and difficulty
            levels. Track your progress, improve your performance, and
            get instant AI-powered feedback.
          </p>
 
          <ul className="mt-8 space-y-4 text-slate-700">
            <li>✓ Choose from 100+ skills and topics</li>
            <li>✓ Get instant results with explanations</li>
            <li>✓ Track your performance history</li>
          </ul>
 
          <div className="flex flex-wrap gap-4 mt-10">
            <button onClick={() => router.push("/user/signup")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition">
              Get Started Free
            </button>
 
            <button
      onClick={() => router.push("/user/login")}
      className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
    >
              Login
            </button>
          </div>
        </div>
 
        {/* Right Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 
          <FeatureCard
            icon={<FileText className="w-6 h-6 text-blue-600" />}
            title="Custom Tests"
            desc="Select your skill, topic, and difficulty level."
          />
 
          <FeatureCard
            icon={<Clock className="w-6 h-6 text-blue-600" />}
            title="Timed Assessments"
            desc="Simulate real-world test conditions."
          />
 
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
            title="Progress Tracking"
            desc="Monitor improvement over time."
          />
 
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
            title="Detailed Results"
            desc="Get explanations and insights for every answer."
          />
 
        </div>
      </div>
    </section>
  );
}
 
function FeatureCard({ title, desc, icon }) {
  return (
    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-6
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-2
        transition-all
        duration-300
        cursor-pointer
      "
    >
      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
        {icon}
      </div>
 
      <h3 className="font-semibold text-lg text-slate-900">
        {title}
      </h3>
 
      <p className="text-sm text-slate-500 mt-2">
        {desc}
      </p>
    </div>
  );
}
 