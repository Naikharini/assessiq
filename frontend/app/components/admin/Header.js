"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [admin, setAdmin] = useState({ id: "", name: "", email: "" });

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  const initials = admin.name
    ? admin.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "A";

  return (
    <header className="glass-nav rounded-2xl flex items-center px-6 gap-4 mb-6 py-3">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search candidates, assessments..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-sm text-slate-700"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <button className="relative p-2 rounded-xl glass-subtle hover:bg-white/60 transition">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3 glass-subtle rounded-xl px-3 py-2">
          <div className="w-9 h-9 rounded-full glass-btn flex items-center justify-center text-sm font-bold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {admin.name || "Admin"}
            </p>
            <p className="text-xs text-slate-500">{admin.email || ""}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
