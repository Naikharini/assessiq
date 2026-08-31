"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/user/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/user/assessment", label: "New Assessment", icon: "📝" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 p-2">
      <div className="glass-sidebar rounded-2xl p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
          Menu
        </p>
        <ul className="space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    active
                      ? "glass-active"
                      : "text-slate-600 hover:bg-white/50"
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
