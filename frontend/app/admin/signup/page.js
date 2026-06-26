"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminSignup() {
  const router = useRouter();

  const handleSignup = (e) => {
    e.preventDefault();

    // Add signup validation/API here

    alert("Account created successfully!");

    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">

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
            Create Admin Account
          </h1>

          <p className="text-slate-500 mt-2">
            Register to access the AssessIQ Admin Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="mt-8 space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Create password"
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm password"
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/admin/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
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