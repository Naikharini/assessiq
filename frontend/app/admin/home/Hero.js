"use client";
import Link from "next/link";

export default function HeroPage() {
  return (
    <div className="min-h-screen bg-white">

      <header className="flex justify-between items-center px-10 py-4 border-b">
        <div className="font-semibold text-lg">AssessIQ</div>
        <div className="text-sm text-gray-500">Admin Login</div>
      </header>

      <div className="text-center mt-20 px-6">

        <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
          Admin Portal
        </span>

        <h1 className="text-4xl font-bold mt-5">
          Manage Your Assessment Platform with Ease
        </h1>

        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Monitor users, manage assessments and control platform efficiently.
        </p>

        <Link
          href="/admin-features"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Go to Admin Features
        </Link>

      </div>
    </div>
  );
}