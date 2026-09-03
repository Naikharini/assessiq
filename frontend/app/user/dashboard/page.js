"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Lock, CheckCircle2, Play } from "lucide-react";

import DashboardNavbar from "../../components/user/DashboardNavbar";
import DashboardSidebar from "../../components/user/DashboardSidebar";
import StatsCard from "../../components/user/StatsCard";
import AssessmentCard from "../../components/user/AssessmentCard";
import WelcomeBanner from "../../components/user/WelcomeBanner";
import { apiFetch } from "../../lib/api";
import { useAuthGuard } from "../../lib/auth";

export default function Dashboard() {
  const router = useRouter();
  useAuthGuard("user");

  const [stats, setStats] = useState({
    totalAssessments: 0,
    averageScore: 0,
    thisWeek: 0,
  });
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Keep current time updated for live schedule unlocking
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, assignedData] = await Promise.all([
          apiFetch("/api/assessment/stats"),
          apiFetch("/api/assessment/assigned"),
        ]);
        setStats(statsData.stats);
        setRecentAttempts(statsData.recentAttempts || []);
        setAssigned(assignedData.assessments || []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  const isScheduleActive = (scheduleDate) => {
    if (!scheduleDate) return true;
    return new Date(scheduleDate).getTime() <= currentTime;
  };

  const formatSchedule = (scheduleDate) => {
    if (!scheduleDate) return "Available Now";
    const d = new Date(scheduleDate);
    return d.toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const startAssignedTest = async (assessment) => {
    if (!isScheduleActive(assessment.scheduleDate)) {
      alert(
        `This assessment is scheduled to start on ${new Date(
          assessment.scheduleDate
        ).toLocaleString()}.`
      );
      return;
    }

    try {
      const data = await apiFetch(`/api/attempts/assessment/${assessment.id}`);
      sessionStorage.setItem("questions", JSON.stringify(data.questions));
      sessionStorage.setItem(
        "assessment",
        JSON.stringify({
          id: data.assessment.id,
          skill: data.assessment.skill,
          topic: data.assessment.topic,
          difficulty: data.assessment.difficulty,
          questionCount: data.questions.length,
          duration: data.assessment.duration || assessment.duration || 45,
        })
      );
      router.push("/user/test");
    } catch (err) {
      alert(err.message || "Failed to load assessment");
    }
  };

  return (
    <div className="min-h-screen mesh-content">
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto flex gap-6 py-6 px-4">
        <DashboardSidebar />

        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl text-black font-bold">Welcome Back!</h1>
              <p className="text-gray-500 mt-2">
                Track your assessment progress and performance
              </p>
            </div>

            <button
              onClick={() => router.push("/user/assessment")}
              className="glass-btn px-6 py-3 rounded-xl text-sm font-medium"
            >
              + New Assessment
            </button>
          </div>

          <div className="grid grid-cols-3 gap-5 mt-8">
            <StatsCard
              title="Total Assessments"
              value={String(stats.totalAssessments)}
              subtitle="All time"
            />

            <StatsCard
              title="Average Score"
              value={`${stats.averageScore}%`}
              subtitle="Across all tests"
            />

            <StatsCard
              title="This Week"
              value={String(stats.thisWeek)}
              subtitle="Completed assessments"
            />
          </div>

          <div className="mt-8">
            <WelcomeBanner />
          </div>

          {assigned.length > 0 && (
            <>
              <h2 className="text-3xl text-black font-bold mt-10 mb-6">
                Assigned Assessments
              </h2>
              <div className="space-y-4">
                {assigned.map((item) => {
                  const unlocked = isScheduleActive(item.scheduleDate);

                  return (
                    <div
                      key={item.id}
                      className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-black text-lg">
                            {item.name}
                          </h3>
                          {item.scheduleDate && !unlocked ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 border border-amber-200 text-amber-700">
                              <Calendar size={12} /> Scheduled
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-700">
                              <CheckCircle2 size={12} /> Available
                            </span>
                          )}
                        </div>

                        <p className="text-gray-500 text-sm">
                          {item.skills || item.jobRole} • {item.difficulty} •{" "}
                          {item.questions?.length || 0} questions •{" "}
                          {item.duration || 45} mins
                        </p>

                        {item.scheduleDate && (
                          <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
                            <Clock size={13} className="text-slate-400" />
                            <span>
                              {unlocked ? "Started: " : "Scheduled for: "}
                              <strong className="text-slate-700 font-semibold">
                                {formatSchedule(item.scheduleDate)}
                              </strong>
                            </span>
                          </p>
                        )}
                      </div>

                      <div>
                        {unlocked ? (
                          <button
                            onClick={() => startAssignedTest(item)}
                            className="glass-btn px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2"
                          >
                            <Play size={14} /> Start Test
                          </button>
                        ) : (
                          <button
                            onClick={() => startAssignedTest(item)}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed flex items-center gap-2"
                          >
                            <Lock size={14} /> Locked
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <h2 className="text-3xl text-black font-bold mt-10 mb-6">
            Recent Assessments
          </h2>

          <div className="space-y-5">
            {recentAttempts.length === 0 ? (
              <p className="text-gray-500">
                No assessments yet. Create your first AI assessment!
              </p>
            ) : (
              recentAttempts.map((attempt) => (
                <AssessmentCard
                  key={attempt.id}
                  title={attempt.Assessment?.name || "Assessment"}
                  level={attempt.Assessment?.difficulty || "—"}
                  topic={attempt.Assessment?.topic || attempt.Assessment?.skills || "—"}
                  score={`${attempt.correctCount}/${attempt.totalQuestions}`}
                  percent={`${attempt.percentage}%`}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
