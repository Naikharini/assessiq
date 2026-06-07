"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 
  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    alert("Login successful (frontend only)");

    router.push("/user/dashboard");
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
            Welcome Back
          </h1>

          <p className="text-slate-500 mt-2">
            Sign in to continue to AssessIQ
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleLogin}>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={() => router.push("/user/dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition">
           Login
         </button>
        </form>

        {/* Signup */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link href="/user/signup" className="text-blue-600 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Back */}
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-blue-600">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}