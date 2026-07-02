"use client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";
import { Users, FileText, CheckCircle, Star, Clock, Flag, Download } from
  "lucide-react";
const stats = [
  {
    label: "Total Candidates", value: "5,248", sub: "+12% this month", icon:
      Users,
    color: "blue"
  },
  {
    label: "Total Assessments", value: "342",
    sub: "Active assessments", icon:
      FileText,
    color: "indigo"
  },
  {
    label: "Completed",
    value: "2,875", sub: "Completion rate 84%", icon:
      CheckCircle, color: "green"
  },
  {
    label: "Average Score",
    value: "78%",
    sub: "Across all assessments",
    icon: Star,
    color: "amber"
  },
  {
    label: "Avg. Completion",
    value: "32 min", sub: "Platform average",
    icon:
      Clock,
    color: "purple"
  },
  {
    label: "Flagged Attempts", value: "24",
    sub: "Potential malpractice",
    icon: Flag,
    color: "red"
  },
]; const colorMap = {
  blue:
  {
    bg: "bg-blue-50",
    text: "text-blue-600"
  },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  red:
  {
    bg: "bg-red-50",
    text: "text-red-600"
  },
};
const scoreData = [
  { range: "0-20", count: 45 },
  { range: "20-40", count: 210 },
  { range: "40-60", count: 480 },
  { range: "60-80", count: 920 },
  { range: "80-100", count: 1220 },
];
const activityData = [
  { day: "D1", MCQ: 20 }, { day: "D2", MCQ: 35 }, { day: "D3", MCQ: 28 },
  { day: "D4", MCQ: 50 }, { day: "D5", MCQ: 42 }, { day: "D6", MCQ: 60 },
  { day: "D7", MCQ: 55 }, { day: "D8", MCQ: 70 }, { day: "D9", MCQ: 65 },
  { day: "D10", MCQ: 80 }, { day: "D11", MCQ: 74 }, { day: "D12", MCQ: 90 },
  { day: "D13", MCQ: 85 }, { day: "D14", MCQ: 95 },
];
const recent = [
  {
    candidate: "Priya Sharma",
    assessment: "Frontend Engineer — React",
    difficulty: "Hard",
    score: 92,
    pct: "92%",
    time: "44m",
    started: "10:38",
    completed: "11:22",
    status: "Passed",
  },
  {
    candidate: "James Wilson",
    assessment: "Data Analyst Aptitude",
    difficulty: "Medium",
    score: 76,
    pct: "76%",
    time: "28m",
    started: "12:33",
    completed: "13:01",
    status: "Passed",
  },
  {
    candidate: "Anika Iyer",
    assessment: "Backend Node.js",
    difficulty: "Expert",
    score: 58,
    pct: "58%",
    time: "61m",
    started: "10:46",
    completed: "11:47",
    status: "Failed",
  },
  {
    candidate: "Mohamed Ali",
    assessment: "Product Manager Aptitude",
    difficulty: "Medium",
    score: 84,
    pct: "84%",
    time: "22m",
    started: "09:50",
    completed: "10:12",
    status: "In Review",
  },
  {
    candidate: "Sofia García",
    assessment: "SQL Mastery",
    difficulty: "Hard",
    score: 0,
    pct: "0%",
    time: "-",
    started: "09:30",
    completed: "-",
    status: "In Progress",
  },
];
const statusStyle = {
  "Passed":
    "bg-green-100 text-green-700", "Failed":
    "bg-red-100 text-red-700",
  "In Review":
    "bg-orange-100 text-orange-700",
  "In Progress": "bg-blue-100 text-blue-700",
};
export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Admin Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Monitor platform
            performance, assessment activity, and candidate engagement.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">Last 30 days</span>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color }) => {
          const c = colorMap[color];
          return (
            <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
                <Icon size={16} className={c.text} />
              </div>
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className="text-xl font-bold text-slate-800">{value}</p>
              <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
            </div>
          );
        })}
      </div>
      {/* Charts row */}<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Activity chart */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Daily
            Assessment Activity</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={activityData} margin={{
              top: 5, right: 10, left: -
                20, bottom: 0
            }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="MCQ" stroke="#3b82f6"
                strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Score distribution */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-1">Score
            Distribution</h2>
          <p className="text-xs text-slate-400 mb-4">Across all completed
            assessments</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scoreData} margin={{
              top: 5, right: 10, left: -20,
              bottom: 0
            }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Performance + Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Assessment
            Performance</h2>
          {[
            ["Most attempted",
              "Frontend Engineer — React"],
            ["Highest scoring", "SQL Mastery (avg 86%)"],
            ["Lowest scoring",
              "System Design Expert (avg 54%)"],
            ["Completion %",
              "84%"],
            ["Avg. difficulty", "3.4 / 5"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-500">{k}</span>
              <span className="text-sm font-medium text-slate-800">{v}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Candidate
            Engagement</h2>
          {[
            ["Daily active candidates",
              "412"],
            ["Avg assessments / candidate", "2.7"],
            ["Weekly participation",
              "+8.2%"],
            ["Returning candidates",
              "63%"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-500">{k}</span>
              <span className="text-sm font-medium text-slate-800">{v}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Recent activity table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-700">Recent
              Assessment Activity</h2>
            <p className="text-xs text-gray-400">Last 24 hours</p></div>
          <button className="text-xs text-blue-600 font-medium hover:underline">View all ↗</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-gray-500">
                {[
                  "Candidate",
                  "Assessment",
                  "Difficulty",
                  "Score",
                  "Time",
                  "Completion",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((r, i) => (
                <tr key={i} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{r.candidate}</td>
                  <td className="px-4 py-3 text-blue-600">{r.assessment}</td>
                  <td className="px-4 py-3 text-slate-600">{r.difficulty}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{r.score > 0
                    ? r.score : "—"}</td>
                  <td className="px-4 py-3 text-slate-500">{r.time}</td>
                  <td className="px-4 py-3 text-slate-500">Today,
                    {r.completed}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}