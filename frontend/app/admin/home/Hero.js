"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-24 text-center bg-white">
      {/* Back to Home */}
            <div className="fixed top-6 left-6 z-50">
  <Link
    href="/"
    className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition"
  >
    ← Back to Home
  </Link>
</div>

      <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600">
        Admin Portal
      </span>

      <h1 className="mt-6 text-5xl font-bold text-slate-900">
        Manage Your Assessment
        <br />
        Platform with Ease
      </h1>

      <p className="mt-4 max-w-2xl mx-auto text-slate-500">
        Monitor user activity, manage assessments, view comprehensive analytics,
        and maintain full control over your MCQ assessment system.
      </p>

      <Link
        href="/admin/login"
        className="inline-block px-6 py-3 mt-8 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Access Admin Dashboard
      </Link>
    </section>
  );
}