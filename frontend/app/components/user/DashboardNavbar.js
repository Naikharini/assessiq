"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DashboardNavbar() {
  const router = useRouter();
  const [user, setUser] = useState({ fullName: "", email: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/user/login");
  };

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="glass-nav sticky top-0 z-40 mesh-content">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        <Image src="/Logo.png" alt="AssessIQ" width={150} height={45} />

        <div className="flex items-center gap-4">
          <div className="glass-subtle rounded-xl px-4 py-2 text-right hidden sm:block">
            <p className="font-semibold text-slate-800 text-sm">{user.fullName}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>

          <div className="w-9 h-9 rounded-full glass-btn flex items-center justify-center text-sm font-bold sm:hidden">
            {initials}
          </div>

          <button
            onClick={handleLogout}
            className="glass-subtle hover:bg-red-50 text-red-600 border-red-200/50 px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
