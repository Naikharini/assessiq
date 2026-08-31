"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  const startAssignedTest = async (assessment) => {
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
                {assigned.map((item) => (
                  <div
                    key={item.id}
                    className="glass-card rounded-2xl p-5 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-black">{item.name}</h3>
                      <p className="text-gray-500 text-sm">
                        {item.skills || item.jobRole} • {item.difficulty} •{" "}
                        {item.questions?.length || 0} questions
                      </p>
                    </div>
                    <button
                      onClick={() => startAssignedTest(item)}
                      className="glass-btn px-5 py-2 rounded-xl text-sm"
                    >
                      Start
                    </button>
                  </div>
                ))}
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
