"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Download, Eye, FileText, ChevronDown } from "lucide-react";

const ASSESSMENTS = [
  {
    candidate: "Priya Sharma",
    email: "priya@acme.io",
    assessment: "Frontend Engineer — React",
    difficulty: "Hard",
    qs: 12,
    correct: 11,
    score: 92,
    pct: "92%",
    time: "44m",
    started: "10:38",
    completed: "11:22",
    status: "Passed",
  },
  {
    candidate: "James Wilson",
    email: "james@acme.io",
    assessment: "Data Analyst Aptitude",
    difficulty: "Medium",
    qs: 30,
    correct: 23,
    score: 76,
    pct: "76%",
    time: "28m",
    started: "12:33",
    completed: "13:01",
    status: "Passed",
  },
  {
    candidate: "Anika Iyer",
    email: "anika@bluefin.co",
    assessment: "Backend Node.js",
    difficulty: "Expert",
    qs: 8,
    correct: 5,
    score: 58,
    pct: "58%",
    time: "61m",
    started: "10:46",
    completed: "11:47",
    status: "Failed",
  },
  {
    candidate: "Mohamed Ali",
    email: "mali@nordic.dev",
    assessment: "Product Manager Aptitude",
    difficulty: "Medium",
    qs: 6,
    correct: 5,
    score: 84,
    pct: "84%",
    time: "22m",
    started: "09:50",
    completed: "10:12",
    status: "In Review",
  },
  {
    candidate: "Sofia García",
    email: "sofia@cardinal.app",
    assessment: "SQL Mastery",
    difficulty: "Hard",
    qs: 15,
    correct: 0,
    score: 0,
    pct: "0%",
    time: "-",
    started: "09:30",
    completed: "-",
    status: "In Progress",
  },
  {
    candidate: "Liam Chen",
    email: "liam@northwind.io",
    assessment: "Cloud Architect",
    difficulty: "Expert",
    qs: 10,
    correct: 8,
    score: 88,
    pct: "88%",
    time: "52m",
    started: "Yesterday",
    completed: "Yesterday",
    status: "Passed",
  },
  {
    candidate: "Emma Becker",
    email: "emma@vantage.com",
    assessment: "Quick Logic Check",
    difficulty: "Easy",
    qs: 20,
    correct: 13,
    score: 65,
    pct: "65%",
    time: "12m",
    started: "Yesterday",
    completed: "Yesterday",
    status: "Passed",
  },
  {
    candidate: "Raj Patel",
    email: "raj@tglobal.in",
    assessment: "Java Fundamentals",
    difficulty: "Medium",
    qs: 25,
    correct: 18,
    score: 72,
    pct: "72%",
    time: "35m",
    started: "Yesterday",
    completed: "Yesterday",
    status: "Passed",
  },
];

const statusStyle = {
  Passed: "bg-green-100 text-green-700",
  Failed: "bg-red-100 text-red-700",
  "In Review": "bg-orange-100 text-orange-700",
  "In Progress": "bg-blue-100 text-blue-700",
};

const difficulties = ["All", "Easy", "Medium", "Hard", "Expert"];
const statuses = ["All", "Passed", "Failed", "In Review", "In Progress"];

export default function ManageResults() {
  const [candidateSearch, setCandidateSearch] = useState("");
  const [assessmentSearch, setAssessmentSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState("All");
  const [diffOpen, setDiffOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const router = useRouter();

  const filtered = ASSESSMENTS.filter((r) => {
    const cMatch = r.candidate.toLowerCase().includes(candidateSearch.toLowerCase());
    const aMatch = r.assessment.toLowerCase().includes(assessmentSearch.toLowerCase());
    const dMatch = difficulty === "All" || r.difficulty === difficulty;
    const sMatch = status === "All" || r.status === status;

    return cMatch && aMatch && dMatch && sMatch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Manage Results
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track assessment completion and candidate performance.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap text-gray-600 gap-3">
        {/* Candidate search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={candidateSearch}
            onChange={(e) => setCandidateSearch(e.target.value)}
            placeholder="Search candidate..."
            className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
          />
        </div>

        {/* Assessment search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={assessmentSearch}
            onChange={(e) => setAssessmentSearch(e.target.value)}
            placeholder="Search assessment..."
            className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
          />
        </div>

        {/* Difficulty dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setDiffOpen(!diffOpen);
              setStatusOpen(false);
            }}
            className="flex items-center justify-between gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white hover:bg-slate-50 min-w-[130px]"
          >
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-gray-400" />
              <span className="text-gray-700">
                {difficulty === "All" ? "All Difficulties" : difficulty}
              </span>
            </div>
            <ChevronDown size={13} className="text-gray-400" />
          </button>

          {diffOpen && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[150px]">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDifficulty(d);
                    setDiffOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${
                    difficulty === d ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                  }`}
                >
                  {d === "All" ? "All Difficulties" : d}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setStatusOpen(!statusOpen);
              setDiffOpen(false);
            }}
            className="flex items-center justify-between gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white hover:bg-slate-50 min-w-[130px]"
          >
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-gray-400" />
              <span className="text-gray-700">
                {status === "All" ? "All Statuses" : status}
              </span>
            </div>
            <ChevronDown size={15} className="text-gray-400" />
          </button>

          {statusOpen && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[140px]">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatus(s);
                    setStatusOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${
                    status === s ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                  }`}
                >
                  {s === "All" ? "All Statuses" : s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 border-b border-slate-100">
                {[
                  "Candidate",
                  "Email",
                  "Assessment",
                  "Difficulty",
                  "Q's",
                  "Correct",
                  "Score",
                  "%",
                  "Status",
                  "",
                ].map((h) => (
                  <th key={h} className="px-3 py-3 text-left font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-400 text-sm">
                    No assessments match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={i} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3 font-medium text-slate-800 whitespace-nowrap">
                      {r.candidate}
                    </td>
                    <td className="px-3 py-3 text-slate-500 text-xs">{r.email}</td>
                    <td className="px-3 py-3 text-blue-600 whitespace-nowrap">{r.assessment}</td>
                    <td className="px-3 py-3 text-slate-600">{r.difficulty}</td>
                    <td className="px-3 py-3 text-slate-700">{r.qs}</td>
                    <td className="px-3 py-3 text-slate-700">{r.correct}</td>
                    <td className="px-3 py-3 font-bold text-slate-800">
                      {r.score > 0 ? r.score : "—"}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{r.pct}</td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const id = r.candidate.toLowerCase().replace(/\s+/g, "-");
                            router.push(`/admin/assessment/Report/${id}`);
                          }}
                          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-500 transition-colors"
                        >
                          <Eye size={14} />
                        </button>

                        <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-500 transition-colors">
                          <FileText size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
          Showing {filtered.length} of {ASSESSMENTS.length} assessments
        </div>
      </div>
    </div>
  );
}