"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  return (
    <nav className="glass-nav sticky top-0 z-50 mesh-content">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <Image
            src="/Logo.png"
            alt="AssessIQ Logo"
            width={160}
            height={40}
            priority
          />
        </Link>

        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <button
              onClick={() => setLoginOpen(!loginOpen)}
              className="glass-btn-outline px-6 py-2 rounded-xl text-sm font-medium"
            >
              Login
            </button>

            {loginOpen && (
              <div className="absolute right-0 mt-2 w-44 glass-dropdown rounded-xl overflow-hidden">
                <Link
                  href="/user/login"
                  className="block px-4 py-2.5 hover:bg-white/60 text-slate-800 text-sm"
                  onClick={() => setLoginOpen(false)}
                >
                  User Login
                </Link>
                <Link
                  href="/admin/login"
                  className="block px-4 py-2.5 hover:bg-white/60 text-slate-800 text-sm"
                  onClick={() => setLoginOpen(false)}
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setSignupOpen(!signupOpen)}
              className="glass-btn px-6 py-2 rounded-xl text-sm font-medium"
            >
              Sign Up
            </button>

            {signupOpen && (
              <div className="absolute right-0 mt-2 w-44 glass-dropdown rounded-xl overflow-hidden">
                <Link
                  href="/user/signup"
                  className="block px-4 py-2.5 hover:bg-white/60 text-slate-800 text-sm"
                  onClick={() => setSignupOpen(false)}
                >
                  User Signup
                </Link>
                <Link
                  href="/admin/signup"
                  className="block px-4 py-2.5 hover:bg-white/60 text-slate-800 text-sm"
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
