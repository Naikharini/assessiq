
 "use client";
import { useRouter } from "next/navigation";

import DashboardNavbar from "../../components/user/DashboardNavbar";
import DashboardSidebar from "../../components/user/DashboardSidebar";
import StatsCard from "../../components/user/StatsCard";
import AssessmentCard from "../../components/user/AssessmentCard";
import WelcomeBanner from "../../components/user/WelcomeBanner";
export default function Dashboard() {
    const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar />
 
      <div className="max-w-7xl mx-auto flex gap-6 py-6 px-4">
        <DashboardSidebar />
 
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl  text-black font-bold">
                Welcome Back!
              </h1>
 
              <p className="text-gray-500 mt-2">
                Track your assessment progress and performance
              </p>
            </div>
 
            <button
            onClick={() => router.push("/user/assessment")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl">
            + New Assessment
            </button>
          </div>
 
          <div className="grid grid-cols-3 gap-5 mt-8">
            <StatsCard
              title="Total Assessments"
              value="3"
              subtitle="All time"
            />
 
            <StatsCard
              title="Average Score"
              value="83%"
              subtitle="Across all tests"
            />
 
            <StatsCard
              title="This Week"
              value="3"
              subtitle="Completed assessments"
            />
          </div>
 
          <div className="mt-8">
            <WelcomeBanner />
          </div>
 
          <h2 className="text-3xl text-black font-bold mt-10 mb-6">
            Recent Assessments
          </h2>
 
          <div className="space-y-5">
            <AssessmentCard
              title="JavaScript"
              level="Intermediate"
              topic="React Hooks"
              score="8/10"
              percent="80%"
            />
 
            <AssessmentCard
              title="Python"
              level="Advanced"
              topic="Data Structures"
              score="12/15"
              percent="80%"
            />
 
            <AssessmentCard
              title="SQL"
              level="Beginner"
              topic="Database Queries"
              score="7/8"
              percent="88%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
 