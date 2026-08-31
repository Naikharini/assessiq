"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  BarChart3,
  LogOut,
} from "lucide-react";

const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "manage", label: "Manage Assessments", icon: ClipboardList },
  { id: "create", label: "Create Assessment", icon: PlusCircle },
  { id: "results", label: "Results", icon: BarChart3 },
];

export default function Sidebar({ activePage, setActivePage }) {
  const router = useRouter();

  return (
    <aside className="w-64 glass-sidebar flex flex-col rounded-r-2xl m-2 ml-0 h-[calc(100vh-16px)]">
      <div className="h-24 flex justify-center items-center border-b border-white/40">
        <Image src="/Logo.png" alt="Logo" width={160} height={60} priority />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              activePage === id
                ? "glass-active"
                : "text-slate-600 hover:bg-white/40"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="border-t border-white/40 p-4">
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("admin");
            router.push("/admin/login");
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50/60 text-red-600 text-sm font-medium transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
