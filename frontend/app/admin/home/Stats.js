"use client";
import Link from "next/link";

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-white p-10">

      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="font-semibold text-lg">Platform Stats</h1>

        <Link href="/" className="text-blue-600 text-sm">
          ← Back
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-10">

        <div className="border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Overview</h2>

          <ul className="space-y-3 text-sm text-gray-600">
            <li>✔ Users: 3</li>
            <li>✔ Assessments: 5</li>
            <li>✔ Avg Score: 78%</li>
            <li>✔ Active Users: 2</li>
          </ul>
        </div>

        <div className="border rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Quick Stats</h2>

          <div className="grid grid-cols-2 gap-4">

            <Box label="Users" value="3" />
            <Box label="Tests" value="5" />
            <Box label="Score" value="78%" />
            <Box label="Active" value="2" />

          </div>
        </div>

      </div>

      <div className="mt-10">
        <Link
          href="/admin-features"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Back to Features
        </Link>
      </div>

    </div>
  );
}

function Box({ label, value }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg text-center">
      <div className="text-blue-600 font-bold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}