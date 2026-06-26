"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  LogOut,
} from "lucide-react";

const nav = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "manage",
    label: "Manage Assessments",
    icon: ClipboardList,
  },
  {
    id: "create",
    label: "Create Assessment",
    icon: PlusCircle,
  },
];

export default function Sidebar({ activePage, setActivePage }) {
    const router = useRouter();
  return (
    <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Logo Section */}
<div className="flex items-center justify-center px-4 py-4 border-b border-slate-100">
  <div className="relative w-full h-24">
    <Image
      src="/Logo.png"
      alt="AssessIQ Logo"
      fill
      className="object-contain"
      priority
    />
  </div>
</div>
          
     

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 px-2 mb-2">
          Main Menu
        </p>

        {nav.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activePage === id
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
<div className="px-3 py-4 border-t border-slate-100">
  <button
    onClick={() => router.push("/admin")}
    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 transition-all"
  >
    <LogOut size={16} />
    <span>Logout</span>
  </button>
</div>
    </aside>
  );
}