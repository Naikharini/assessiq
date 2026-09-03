"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  RotateCcw,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { apiFetch } from "../../lib/api";
import {
  AttemptReviewPanel,
  AttemptFeedbackPanel,
} from "./AttemptResultPanels";

const statusStyle = {
  Passed: "bg-emerald-50 border border-emerald-200 text-emerald-700",
  Failed: "bg-red-50 border border-red-200 text-red-700",
  Completed: "bg-blue-50 border border-blue-200 text-blue-700",
};

export default function ManageResults() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [activePanel, setActivePanel] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [attemptDetails, setAttemptDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/attempts/all", {}, "admin");
      setAttempts(data.attempts || []);
    } catch (err) {
      console.error("Failed to load attempts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  const getStatus = (attempt) => {
    const passing = Number(
      attempt.Assessment?.passingScore ?? attempt.assessment?.passingScore ?? 60
    );
    const score = Number(attempt.percentage ?? attempt.score ?? 0);
    return score >= passing ? "Passed" : "Failed";
  };

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openPanel = async (attempt, panelType) => {
    setActivePanel(panelType);
    setSelectedAttempt(attempt);
    setAttemptDetails([]);
    setDetailsLoading(true);

    try {
      const data = await apiFetch(`/api/attempts/${attempt.id}`, {}, "admin");
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

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setDifficultyFilter("All");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "All" ||
    difficultyFilter !== "All" ||
    sortBy !== "newest";

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return attempts
      .filter((r) => {
        const candidateName = (
          r.User?.fullName ||
          r.user?.fullName ||
          ""
        ).toLowerCase();
        const candidateEmail = (
          r.User?.email ||
          r.user?.email ||
          ""
        ).toLowerCase();
        const assessName = (
          r.Assessment?.name ||
          r.assessment?.name ||
          ""
        ).toLowerCase();
        const assessSkills = (
          r.Assessment?.skills ||
          r.Assessment?.jobRole ||
          r.assessment?.skills ||
          ""
        ).toLowerCase();
        const assessTopic = (
          r.Assessment?.topic ||
          r.assessment?.topic ||
          ""
        ).toLowerCase();
        const assessDifficulty = (
          r.Assessment?.difficulty ||
          r.assessment?.difficulty ||
          ""
        ).toLowerCase();

        // 1. Text Search matching across name, email, test title, skills, topic
        const matchSearch =
          !q ||
          candidateName.includes(q) ||
          candidateEmail.includes(q) ||
          assessName.includes(q) ||
          assessSkills.includes(q) ||
          assessTopic.includes(q);

        // 2. Status Match
        const rStatus = getStatus(r);
        const matchStatus =
          statusFilter === "All" ||
          rStatus.toLowerCase() === statusFilter.toLowerCase();

        // 3. Difficulty Match
        const matchDifficulty =
          difficultyFilter === "All" ||
          assessDifficulty.includes(difficultyFilter.toLowerCase());

        return matchSearch && matchStatus && matchDifficulty;
      })
      .sort((a, b) => {
        const scoreA = Number(a.percentage ?? a.score ?? 0);
        const scoreB = Number(b.percentage ?? b.score ?? 0);
        const dateA = new Date(a.completedAt || a.createdAt).getTime();
        const dateB = new Date(b.completedAt || b.createdAt).getTime();

        if (sortBy === "highest_score") return scoreB - scoreA;
        if (sortBy === "lowest_score") return scoreA - scoreB;
        if (sortBy === "oldest") return dateA - dateB;
        return dateB - dateA; // Default: newest first
      });
  }, [attempts, searchQuery, statusFilter, difficultyFilter, sortBy]);

  const exportToCSV = () => {
    if (!filtered || filtered.length === 0) {
      alert("No results available to export.");
      return;
    }

    const headers = [
      "Candidate Name",
      "Candidate Email",
      "Assessment Name",
      "Job Role / Skills",
      "Difficulty",
      "Total Questions",
      "Correct Answers",
      "Score (%)",
      "Passing Score (%)",
      "Status",
      "Submitted Date",
    ];

    const escapeCell = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = filtered.map((r) => {
      const attemptStatus = getStatus(r);
      const dateStr =
        r.completedAt || r.createdAt
          ? new Date(r.completedAt || r.createdAt).toLocaleString()
          : "—";

      return [
        escapeCell(r.User?.fullName || r.user?.fullName || "—"),
        escapeCell(r.User?.email || r.user?.email || "—"),
        escapeCell(r.Assessment?.name || r.assessment?.name || "—"),
        escapeCell(
          r.Assessment?.skills ||
            r.Assessment?.jobRole ||
            r.assessment?.skills ||
            "—"
        ),
        escapeCell(r.Assessment?.difficulty || r.assessment?.difficulty || "—"),
        escapeCell(r.totalQuestions ?? 0),
        escapeCell(r.correctCount ?? 0),
        escapeCell(`${r.percentage ?? 0}%`),
        escapeCell(`${r.Assessment?.passingScore ?? 60}%`),
        escapeCell(attemptStatus),
        escapeCell(dateStr),
      ].join(",");
    });

    const csvString = [headers.join(","), ...csvRows].join("\r\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Candidate_Results_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Manage Results</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track assessment completion, candidate scores, and performance insights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAttempts}
            title="Reload latest attempts"
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium transition cursor-pointer"
          >
            <RotateCcw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            onClick={exportToCSV}
            title="Download filtered results as CSV"
            className="flex items-center gap-2 glass-btn px-4 py-2 rounded-xl text-sm font-medium cursor-pointer"
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-strong rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Universal Search Input */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, email, test..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Statuses (Passed &amp; Failed)</option>
              <option value="Passed">Passed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner / Easy</option>
              <option value="Intermediate">Intermediate / Medium</option>
              <option value="Advanced">Advanced / Hard</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest_score">Sort: Highest Score</option>
              <option value="lowest_score">Sort: Lowest Score</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 font-medium">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="hover:text-blue-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {statusFilter !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter("All")} className="hover:text-blue-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {difficultyFilter !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                  Difficulty: {difficultyFilter}
                  <button onClick={() => setDifficultyFilter("All")} className="hover:text-blue-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {sortBy !== "newest" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                  Order: {sortBy.replace("_", " ")}
                  <button onClick={() => setSortBy("newest")} className="hover:text-blue-900">
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={resetFilters}
              className="text-red-600 hover:text-red-700 font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} /> Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className="glass-table rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 border-b border-slate-200">
                {[
                  "Candidate",
                  "Email",
                  "Assessment",
                  "Difficulty",
                  "Q's",
                  "Correct",
                  "Score",
                  "Status",
                  "Submitted At",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left font-semibold text-slate-700 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-400">
                    Loading candidate results...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-12 text-center text-slate-400 text-sm"
                  >
                    {hasActiveFilters
                      ? "No results matching your filter criteria. Try resetting filters."
                      : "No assessment attempts recorded yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const attemptStatus = getStatus(r);
                  const isPassed = attemptStatus === "Passed";

                  return (
                    <tr
                      key={r.id}
                      className="border-t border-slate-100 hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-4 py-3.5 font-medium text-slate-800 whitespace-nowrap">
                        {r.User?.fullName || r.user?.fullName || "—"}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                        {r.User?.email || r.user?.email || "—"}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-blue-600 whitespace-nowrap">
                        {r.Assessment?.name || r.assessment?.name || "—"}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                          {r.Assessment?.difficulty || r.assessment?.difficulty || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700">
                        {r.totalQuestions ?? 0}
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 font-medium">
                        {r.correctCount ?? 0}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-800">
                        {r.percentage ?? r.score ?? 0}%
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            statusStyle[attemptStatus] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {attemptStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                        {formatDate(r.completedAt || r.createdAt)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            title="View attempt question breakdown"
                            onClick={() => openPanel(r, "review")}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            type="button"
                            title="View performance insights"
                            onClick={() => openPanel(r, "feedback")}
                            className="p-1.5 rounded-lg hover:bg-violet-50 text-slate-500 hover:text-violet-600 transition-colors"
                          >
                            <FileText size={15} />
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

        {/* Footer info bar */}
        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center bg-slate-50/50">
          <span>
            Showing <strong className="text-slate-800">{filtered.length}</strong> of{" "}
            <strong>{attempts.length}</strong> candidate submissions
          </span>
          {filtered.length > 0 && (
            <button
              onClick={exportToCSV}
              className="text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Download size={13} /> Export these {filtered.length} results
            </button>
          )}
        </div>
      </div>

      {/* Review Drawer */}
      <AttemptReviewPanel
        open={activePanel === "review"}
        onClose={closePanel}
        attempt={selectedAttempt}
        details={attemptDetails}
        loading={detailsLoading}
      />

      {/* Feedback Drawer */}
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
