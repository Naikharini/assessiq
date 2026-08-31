"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function UserLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/user/dashboard");
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 mesh-content relative">
      <div className="glass-orb w-72 h-72 bg-indigo-400 top-10 left-10" />
      <div className="glass-orb w-56 h-56 bg-blue-400 bottom-10 right-10" />

      <div className="w-full max-w-md glass-strong rounded-3xl p-8 relative z-10">
        <div className="flex justify-center mb-6">
          <Image src="/Logo.png" alt="AssessIQ Logo" width={180} height={60} priority />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to continue to AssessIQ</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm text-slate-700 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 glass-input text-slate-700 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 glass-input text-slate-700 rounded-xl"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full glass-btn py-3 rounded-xl font-medium">
            Login
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-600">
            Don&apos;t have an account?{" "}
            <Link href="/user/signup" className="text-indigo-600 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
