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
  {
    id: "results",
    label: "Results",
    icon: BarChart3,
  },
];

export default function Sidebar({ activePage, setActivePage }) {
  const router = useRouter();

  return (
    <aside className="w-64 bg-white border-r flex flex-col">

      <div className="h-24 flex justify-center items-center border-b">
        <Image
          src="/Logo.png"
          alt="Logo"
          width={180}
          height={70}
          priority
        />
      </div>

      <nav className="flex-1 p-4 space-y-2">

        {nav.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              console.log(id);
              setActivePage(id);
            }}
            className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 transition

              ${
                activePage === id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-100 text-slate-700"
              }
            `}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}

      </nav>

      <div className="border-t p-4">

        <button
          onClick={() => router.push("/admin/login")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </aside>
  );
}