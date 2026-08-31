"use client";

import { useEffect } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Target,
  Lightbulb,
} from "lucide-react";
import { buildAttemptInsights } from "../../lib/attemptInsights";

const toneStyles = {
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  red: "bg-red-100 text-red-700 border-red-200",
};

function ScoreRing({ percentage, passed }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = passed ? "#10b981" : "#ef4444";

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-800">{percentage}%</span>
        <span className="text-xs text-slate-500">Score</span>
      </div>
    </div>
  );
}

function PanelShell({ open, onClose, title, subtitle, children }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-xl h-full glass-strong border-l border-white/70 shadow-2xl overflow-hidden">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">{title}</h2>
              {subtitle && (
                <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="h-[calc(100%-88px)] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function AttemptReviewPanel({ open, onClose, attempt, details, loading }) {
  const passing = attempt?.Assessment?.passingScore || 60;
  const passed = (attempt?.percentage || 0) >= passing;
  const incorrectCount = details.filter((item) => item.userAnswer && !item.isCorrect).length;

  return (
    <PanelShell
      open={open}
      onClose={onClose}
      title="Attempt Review"
      subtitle={
        attempt
          ? `${attempt.User?.fullName || "Candidate"} • ${attempt.Assessment?.name || "Assessment"}`
          : ""
      }
    >
      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
          Loading attempt breakdown...
        </div>
      ) : !attempt ? (
        <div className="text-center text-slate-400 text-sm py-12">
          Could not load attempt details.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass-subtle rounded-2xl p-5 flex items-center gap-6">
            <ScoreRing percentage={attempt.percentage || 0} passed={passed} />
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    passed ? toneStyles.emerald : toneStyles.red
                  }`}
                >
                  {passed ? "Passed" : "Failed"}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {attempt.Assessment?.difficulty || "—"}
                </span>
              </div>
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">
                  {attempt.correctCount}/{attempt.totalQuestions}
                </span>{" "}
                correct • Passing score {passing}%
              </p>
              <p className="text-xs text-slate-500">
                {attempt.Assessment?.skills || "—"} • {attempt.Assessment?.topic || "—"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Correct",
                value: attempt.correctCount,
                icon: CheckCircle2,
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                label: "Incorrect",
                value: incorrectCount,
                icon: XCircle,
                color: "text-red-600 bg-red-50",
              },
              {
                label: "Total",
                value: attempt.totalQuestions,
                icon: Target,
                color: "text-blue-600 bg-blue-50",
              },
            ].map((stat) => (
              <div key={stat.label} className="glass-subtle rounded-xl p-3 text-center">
                <div
                  className={`inline-flex p-2 rounded-lg mb-2 ${stat.color}`}
                >
                  <stat.icon size={16} />
                </div>
                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Question Timeline
            </h3>
            <div className="space-y-3">
              {details.map((item, index) => {
                const status = !item.userAnswer
                  ? "skipped"
                  : item.isCorrect
                    ? "correct"
                    : "wrong";

                return (
                  <div
                    key={index}
                    className={`rounded-xl border p-4 ${
                      status === "correct"
                        ? "border-emerald-200 bg-emerald-50/60"
                        : status === "wrong"
                          ? "border-red-200 bg-red-50/60"
                          : "border-amber-200 bg-amber-50/60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          status === "correct"
                            ? "bg-emerald-500 text-white"
                            : status === "wrong"
                              ? "bg-red-500 text-white"
                              : "bg-amber-500 text-white"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">
                          {item.question}
                        </p>
                        <div className="mt-2 space-y-1.5">
                          {item.options?.map((option) => {
                            const isCorrect = option === item.correctAnswer;
                            const isChosen = option === item.userAnswer;

                            return (
                              <div
                                key={option}
                                className={`text-xs px-3 py-2 rounded-lg border ${
                                  isCorrect
                                    ? "border-emerald-300 bg-white text-emerald-800"
                                    : isChosen
                                      ? "border-red-300 bg-white text-red-700"
                                      : "border-slate-200 bg-white/70 text-slate-600"
                                }`}
                              >
                                {option}
                                {isCorrect && (
                                  <span className="ml-2 font-semibold">✓</span>
                                )}
                                {isChosen && !isCorrect && (
                                  <span className="ml-2 font-semibold">candidate</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </PanelShell>
  );
}

export function AttemptFeedbackPanel({ open, onClose, attempt, details, loading }) {
  const insights = attempt ? buildAttemptInsights(attempt, details) : null;

  return (
    <PanelShell
      open={open}
      onClose={onClose}
      title="Performance Insights"
      subtitle="AI-style coaching summary for hiring decisions"
    >
      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
          Generating insights...
        </div>
      ) : !insights ? (
        <div className="text-center text-slate-400 text-sm py-12">
          Could not generate feedback.
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl p-5 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white">
            <div className="flex items-center gap-2 text-violet-100 text-xs font-medium mb-2">
              <Sparkles size={14} />
              AssessIQ Verdict
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-bold">{insights.verdict}</p>
                <p className="text-sm text-violet-100 mt-1">{insights.headline}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border bg-white/15 border-white/30`}
              >
                {insights.passed ? "PASS" : "FAIL"}
              </span>
            </div>
          </div>

          <div className="glass-subtle rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-700">Skill Pulse</h3>
            </div>
            <div className="space-y-3">
              {insights.topicMastery.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-800">{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">
              {insights.skill} • {insights.topic} • {insights.difficulty}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <p className="text-xs font-semibold text-emerald-700 mb-2 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Strengths
              </p>
              <ul className="space-y-1.5">
                {insights.strengths.map((item) => (
                  <li key={item} className="text-sm text-emerald-900">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
              <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1.5">
                <AlertCircle size={14} /> Gaps to Address
              </p>
              <ul className="space-y-1.5">
                {insights.gaps.map((item) => (
                  <li key={item} className="text-sm text-amber-900">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
            <p className="text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1.5">
              <Lightbulb size={14} /> Recommended Next Steps
            </p>
            <ul className="space-y-1.5">
              {insights.recommendations.map((item) => (
                <li key={item} className="text-sm text-indigo-900">
                  • {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-strong rounded-2xl p-4 border border-slate-200">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
              Coach&apos;s Note
            </p>
            <p className="text-sm text-slate-700 leading-relaxed italic">
              &ldquo;{insights.coachNote}&rdquo;
            </p>
          </div>
        </div>
      )}
    </PanelShell>
  );
}
