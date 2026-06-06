"use client";
 
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
 
export default function UserSignup() {
  const router = useRouter();
 
  const handleSignup = (e) => {
    e.preventDefault();
 
    // Later connect API here
    console.log("Signup Successful");
 
    router.push("/user/home");
  };
 
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">
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
            Join AssessIQ and start your learning journey
          </p>
        </div>
 
        {/* Signup Form */}
        <form onSubmit={handleSignup} className="mt-8 space-y-5">
 
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
 
            <input
              type="text"
              placeholder="Enter your full name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
 
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
 
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
 
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
 
            <input
              type="password"
              placeholder="Create a password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
 
          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
 
            <input
              type="password"
              placeholder="Confirm your password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
 
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-medium transition"
          >
            Create Account
          </button>
 
        </form>
 
        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/user/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
 
        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-blue-600"
          >
            ← Back to Home
          </Link>
        </div>
 
      </div>
    </div>
  );
}