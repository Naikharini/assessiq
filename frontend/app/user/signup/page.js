"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Passwords not match");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: form.fullName,
        email: form.email,
        password: form.password
      })
    });

    const data = await res.json();

    // ❌ STOP if backend fails
    if (!res.ok || !data.success) {
      alert(data.message || "Signup failed");
      return;
    }

    console.log("Signup success:", data);

    // ✅ redirect ONLY after success
    router.push("/user/login");

  } catch (err) {
    console.log(err);
    alert("Server error");
  }
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
            Create Account
          </h1>

          <p className="text-slate-500 mt-2">
            Sign up to continue to AssessIQ
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSignup} className="mt-8 space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
          >
            Signup
          </button>
        </form>

        {/* Login */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/user/login" className="text-blue-600 font-medium hover:underline">
              Login
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