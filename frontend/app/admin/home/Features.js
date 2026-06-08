"use client";
import Link from "next/link";

export default function AdminFeatures() {
  return (
    <div className="min-h-screen bg-white p-10">

      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="font-semibold text-lg">Admin Features</h1>

        <Link href="/" className="text-blue-600 text-sm">
          ← Back
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <Card title="User Management" />
        <Card title="Assessment Control" />
        <Card title="Analytics Tools" />

      </div>

      <div className="mt-10">
        <Link
          href="/stats"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          View Stats Page
        </Link>
      </div>

    </div>
  );
}

function Card({ title }) {
  return (
    <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <div className="w-10 h-10 bg-blue-100 rounded mb-4"></div>
      <h2 className="font-semibold">{title}</h2>
      <p className="text-sm text-gray-500 mt-2">
        Manage {title.toLowerCase()} efficiently.
      </p>
    </div>
  );
}