"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    // Add login validation/API call here

    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 border border-slate-200">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/Logo.png"
            alt="AssessIQ Logo"
            width={180}
            height={60}
            priority
          />
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Admin Login
          </h1>

          <p className="text-slate-500 mt-2">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter admin email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/admin/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Back */}
        <div className="text-center mt-4">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-blue-600"
          >
            ← Back to Admin Home
          </Link>
        </div>

      </div>
    </div>
  );
}