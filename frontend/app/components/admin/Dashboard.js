"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  HelpCircle,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { apiFetch } from "../../lib/api";

const statusStyle = {
  Passed: "bg-green-100 text-green-700",
  Failed: "bg-red-100 text-red-700",
  "In Review": "bg-orange-100 text-orange-700",
  "In Progress": "bg-blue-100 text-blue-700",
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/stats", {}, "admin");
      setData(res);
    } catch (err) {
      console.error("Failed to load admin stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const exportReport = () => {
    if (!data) {
      alert("No data available to export.");
      return;
    }

    const summaryHeaders = ["Metric", "Value"];
    const summaryRows = [
      ["Total Assessments", data.stats?.totalAssessments ?? 0],
      ["Total Questions", data.stats?.totalQuestions ?? 0],
      ["Registered Candidates", data.stats?.totalCandidates ?? 0],
      ["Total Attempts", data.stats?.totalAttempts ?? 0],
      ["Average Score", `${data.stats?.averageScore ?? 0}%`],
      ["Pass Rate", `${data.stats?.passRate ?? 0}%`],
      ["Active Candidates", data.stats?.activeCandidates ?? 0],
      ["Most Attempted Assessment", data.performance?.mostAttempted || "—"],
      ["Highest Scoring Assessment", data.performance?.highestScoring || "—"],
      ["Lowest Scoring Assessment", data.performance?.lowestScoring || "—"],
    ];

    const escapeCell = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvLines = [
      "=== PLATFORM SUMMARY ===",
      summaryHeaders.join(","),
      ...summaryRows.map(([k, v]) => `${escapeCell(k)},${escapeCell(v)}`),
      "",
      "=== RECENT SUBMISSIONS ===",
      [
        "Candidate",
        "Assessment",
        "Difficulty",
        "Score",
        "Duration",
        "Completed At",
        "Status",
      ].join(","),
      ...(data.recentActivity || []).map((r) =>
        [
          escapeCell(r.candidate),
          escapeCell(r.assessment),
          escapeCell(r.difficulty),
          escapeCell(r.pct),
          escapeCell(r.time),
          escapeCell(r.completed),
          escapeCell(r.status),
        ].join(",")
      ),
    ];

    const blob = new Blob([csvLines.join("\r\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Admin_Overview_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const statsList = [
    {
      label: "Total Assessments",
      value: data?.stats?.totalAssessments ?? 0,
      sub: "Published test suites",
      icon: FileText,
      color: { bg: "bg-blue-50", text: "text-blue-600" },
    },
    {
      label: "Total Questions",
      value: data?.stats?.totalQuestions ?? 0,
      sub: "In question bank",
      icon: HelpCircle,
      color: { bg: "bg-indigo-50", text: "text-indigo-600" },
    },
    {
      label: "Registered Candidates",
      value: data?.stats?.totalCandidates ?? 0,
      sub: `${data?.stats?.activeCandidates ?? 0} active testers`,
      icon: Users,
      color: { bg: "bg-purple-50", text: "text-purple-600" },
    },
    {
      label: "Total Attempts",
      value: data?.stats?.totalAttempts ?? 0,
      sub: "Submissions received",
      icon: Clock,
      color: { bg: "bg-orange-50", text: "text-orange-600" },
    },
    {
      label: "Average Score",
      value: `${data?.stats?.averageScore ?? 0}%`,
      sub: "Across all submissions",
      icon: TrendingUp,
      color: { bg: "bg-green-50", text: "text-green-600" },
    },
    {
      label: "Pass Rate",
      value: `${data?.stats?.passRate ?? 0}%`,
      sub: "Met passing score",
      icon: CheckCircle,
      color: { bg: "bg-emerald-50", text: "text-emerald-600" },
    },
  ];

  const activityData = data?.activityData || [
    { day: "Sun", MCQ: 0 },
    { day: "Mon", MCQ: 0 },
    { day: "Tue", MCQ: 0 },
    { day: "Wed", MCQ: 0 },
    { day: "Thu", MCQ: 0 },
    { day: "Fri", MCQ: 0 },
    { day: "Sat", MCQ: 0 },
  ];

  const scoreData = data?.scoreData || [
    { range: "0-20%", count: 0 },
    { range: "21-40%", count: 0 },
    { range: "41-60%", count: 0 },
    { range: "61-80%", count: 0 },
    { range: "81-100%", count: 0 },
  ];

  const recent = data?.recentActivity || [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Admin Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time platform performance, assessment metrics, and candidate activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            title="Refresh metrics"
            className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            onClick={exportReport}
            title="Export platform analytics and submissions as CSV"
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsList.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="glass-strong rounded-xl p-4 shadow-sm">
            <div className={`w-8 h-8 rounded-lg ${color.bg} flex items-center justify-center mb-3`}>
              <Icon size={16} className={color.text} />
            </div>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-xl font-bold text-slate-800">{value}</p>
            <p className="text-[11px] text-slate-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Activity chart */}
        <div className="glass-strong rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Daily Assessment Activity (Last 7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={activityData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="MCQ"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Score distribution */}
        <div className="glass-strong rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-1">
            Score Distribution
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Across all completed candidate attempts
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scoreData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance + Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-strong rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Assessment Performance
          </h2>
          {[
            ["Most attempted", data?.performance?.mostAttempted || "—"],
            ["Highest scoring", data?.performance?.highestScoring || "—"],
            ["Lowest scoring", data?.performance?.lowestScoring || "—"],
            ["Completion Rate", data?.performance?.completionRate || "—"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-500">{k}</span>
              <span className="text-sm font-medium text-slate-800">{v}</span>
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Candidate Engagement
          </h2>
          {[
            ["Total Registered Candidates", data?.candidateEngagement?.totalCandidates ?? 0],
            ["Active Test Takers", data?.candidateEngagement?.activeCandidates ?? 0],
            ["Avg Assessments / Candidate", data?.candidateEngagement?.avgAssessmentsPerCandidate ?? "0"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-500">{k}</span>
              <span className="text-sm font-medium text-slate-800">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity table */}
      <div className="glass-strong rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-700">
              Recent Assessment Activity
            </h2>
            <p className="text-xs text-slate-400">Live candidate submissions</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500">
                {[
                  "Candidate",
                  "Assessment",
                  "Difficulty",
                  "Score",
                  "Duration",
                  "Completed At",
                  "Status",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-sm">
                    No assessment attempts found in the database.
                  </td>
                </tr>
              ) : (
                recent.map((r, i) => (
                  <tr
                    key={r.id || i}
                    className="border-t border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">{r.candidate}</td>
                    <td className="px-4 py-3 text-blue-600">{r.assessment}</td>
                    <td className="px-4 py-3 text-slate-600">{r.difficulty}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{r.pct}</td>
                    <td className="px-4 py-3 text-slate-500">{r.time}</td>
                    <td className="px-4 py-3 text-slate-500">{r.completed}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusStyle[r.status] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
