"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  return (
    <nav className="border-b bg-white relative">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/">
          <Image
            src="/Logo.png"
            alt="AssessIQ Logo"
            width={160}
            height={40}
            priority
          />
        </Link>

        {/* Right Buttons */}
        <div className="flex items-center gap-4 relative">

          {/* LOGIN DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setLoginOpen(!loginOpen)}
              className="bg-white text-black px-6 py-2 rounded-lg hover:bg-blue-100 transition border border-gray-300"
            >
              Login
            </button>

            {loginOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg overflow-hidden">
                <Link
                  href="/user/login"
                  className="block px-4 py-2 hover:bg-gray-100 text-black"
                  onClick={() => setLoginOpen(false)}
                >
                  User Login
                </Link>

                <Link
                  href="/admin/login"
                  className="block px-4 py-2 hover:bg-gray-100 text-black"
                  onClick={() => setLoginOpen(false)}
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>

          {/* SIGNUP DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setSignupOpen(!signupOpen)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </button>

            {signupOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg overflow-hidden">
                <Link
                  href="/user/signup"
                  className="block px-4 py-2 hover:bg-gray-100 text-black"
                  onClick={() => setSignupOpen(false)}
                >
                  User Signup
                </Link>

                <Link
                  href="/admin/signup"
                  className="block px-4 py-2 hover:bg-gray-100 text-black"
                  onClick={() => setSignupOpen(false)}
                >
                  Admin Signup
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}