"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Download, Eye, FileText, ChevronDown } from "lucide-react";
import { apiFetch } from "../../lib/api";
import {
  AttemptReviewPanel,
  AttemptFeedbackPanel,
} from "./AttemptResultPanels";

const statusStyle = {
  Passed: "bg-green-100 text-green-700",
  Failed: "bg-red-100 text-red-700",
  Completed: "bg-green-100 text-green-700",
};

export default function ManageResults() {
  const [attempts, setAttempts] = useState([]);
  const [candidateSearch, setCandidateSearch] = useState("");
  const [assessmentSearch, setAssessmentSearch] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [status, setStatus] = useState("All");
  const [activePanel, setActivePanel] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [attemptDetails, setAttemptDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch("/api/attempts/all", {}, "admin");
        setAttempts(data.attempts || []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  const getStatus = (attempt) => {
    const passing = attempt.Assessment?.passingScore || 60;
    return attempt.percentage >= passing ? "Passed" : "Failed";
  };

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const openPanel = async (attempt, panelType) => {
    setActivePanel(panelType);
    setSelectedAttempt(attempt);
    setAttemptDetails([]);
    setDetailsLoading(true);

    try {
      const data = await apiFetch(`/api/attempts/${attempt.id}`, {}, "admin");
      setSelectedAttempt(data.attempt || attempt);
      setAttemptDetails(data.attempt?.details || []);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closePanel = () => {
    setActivePanel(null);
    setSelectedAttempt(null);
    setAttemptDetails([]);
  };

  const filtered = attempts.filter((r) => {
    const name = r.User?.fullName || "";
    const email = r.User?.email || "";
    const assessmentName = r.Assessment?.name || "";

    const cMatch =
      name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      email.toLowerCase().includes(candidateSearch.toLowerCase());
    const aMatch = assessmentName
      .toLowerCase()
      .includes(assessmentSearch.toLowerCase());
    const sMatch = status === "All" || getStatus(r) === status;

    return cMatch && aMatch && sMatch;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Manage Results</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track assessment completion and candidate performance.
          </p>
        </div>

        <button className="flex items-center gap-2 glass-btn px-4 py-1.5 rounded-xl text-sm font-medium">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="flex flex-wrap text-gray-600 gap-3">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={candidateSearch}
            onChange={(e) => setCandidateSearch(e.target.value)}
            placeholder="Search candidate..."
            className="pl-8 pr-3 py-2 text-sm glass-input rounded-xl w-44"
          />
        </div>

        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={assessmentSearch}
            onChange={(e) => setAssessmentSearch(e.target.value)}
            placeholder="Search assessment..."
            className="pl-8 pr-3 py-2 text-sm glass-input rounded-xl w-44"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setStatusOpen(!statusOpen)}
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
              {["All", "Passed", "Failed"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatus(s);
                    setStatusOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${
                    status === s
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-slate-700"
                  }`}
                >
                  {s === "All" ? "All Statuses" : s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="glass-table rounded-xl overflow-hidden">
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
                  "Status",
                  "Submitted",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-3 text-left font-medium whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-8 text-center text-slate-400 text-sm"
                  >
                    No results yet. Candidates will appear here after completing
                    assessments.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const attemptStatus = getStatus(r);

                  return (
                    <tr
                      key={r.id}
                      className="border-t border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-3 py-3 font-medium text-slate-800 whitespace-nowrap">
                        {r.User?.fullName || "—"}
                      </td>
                      <td className="px-3 py-3 text-slate-500 text-xs">
                        {r.User?.email || "—"}
                      </td>
                      <td className="px-3 py-3 text-blue-600 whitespace-nowrap">
                        {r.Assessment?.name || "—"}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {r.Assessment?.difficulty || "—"}
                      </td>
                      <td className="px-3 py-3 text-slate-700">
                        {r.totalQuestions}
                      </td>
                      <td className="px-3 py-3 text-slate-700">
                        {r.correctCount}
                      </td>
                      <td className="px-3 py-3 font-bold text-slate-800">
                        {r.percentage}%
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[attemptStatus]}`}
                        >
                          {attemptStatus}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {formatDate(r.completedAt || r.createdAt)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            title="View attempt breakdown"
                            onClick={() => openPanel(r, "review")}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            title="View performance insights"
                            onClick={() => openPanel(r, "feedback")}
                            className="p-1.5 rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-colors"
                          >
                            <FileText size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
          Showing {filtered.length} of {attempts.length} results
        </div>
      </div>

      <AttemptReviewPanel
        open={activePanel === "review"}
        onClose={closePanel}
        attempt={selectedAttempt}
        details={attemptDetails}
        loading={detailsLoading}
      />

      <AttemptFeedbackPanel
        open={activePanel === "feedback"}
        onClose={closePanel}
        attempt={selectedAttempt}
        details={attemptDetails}
        loading={detailsLoading}
      />
    </div>
  );
}
