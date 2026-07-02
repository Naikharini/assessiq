"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, LogOut } from "lucide-react";

export default function Header() {
  const router = useRouter();

  const [admin, setAdmin] = useState({
    id: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    router.push("/admin/login");
  };

  const initials = admin.name
    ? admin.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "A";

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4">

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search candidates, assessments..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="ml-auto flex items-center gap-4">

        {/* Notification */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100">
          <Bell size={20} className="text-slate-600" />

          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Admin Details */}
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {initials}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {admin.name || "Admin"}
            </p>

            <p className="text-xs text-slate-500">
              {admin.email || ""}
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}