"use client";
import { Search, Bell } from "lucide-react";
export default function Header() {
return (
<header className="h-14 bg-white border-b border-slate-200 flex items-center
px-6 gap-4 shrink-0">
<div className="flex-1 max-w-md">
<div className="relative">
<Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2
text-slate-400" />
<input
type="text"
placeholder="Search candidates, assessments..."
className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-
slate-200 rounded-lg focus:outline-none text-gray-500 focus:ring-2 focus:ring-blue-500
focus:border-transparent"
/>
</div>
</div>
<div className="ml-auto flex items-center gap-3">
<button className="relative p-2 rounded-lg hover:bg-slate-100 transition-
colors">
<Bell size={18} className="text-slate-500" />
<span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500
rounded-full" />
</button>
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs
font-bold flex items-center justify-center">
AR
</div>
<div className="hidden sm:block">
<p className="text-sm font-semibold text-slate-800 leading-
tight">Alex Reed</p>
<p className="text-[11px] text-slate-400">Admin</p>
</div>
</div>
</div>
</header>
);}