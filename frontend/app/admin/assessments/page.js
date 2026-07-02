"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, FileText } from "lucide-react";

export default function Page() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await fetch("/api/assessments");
        const data = await res.json();
        setAssessments(data);
      } catch (error) {
        console.error("Error fetching assessments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Manage Assessments
        </h1>
        <p className="text-sm text-slate-500">
          View and manage all published assessments
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-slate-500">Loading assessments...</p>
      ) : assessments.length === 0 ? (
        <p className="text-slate-500">No assessments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {assessments.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-5"
            >
              {/* Title */}
              <h2 className="text-lg font-semibold text-slate-800">
                {item.title}
              </h2>

              {/* Info */}
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <FileText size={14} />
                {item.questions?.length || 0} Questions
              </div>

              {/* Actions */}
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() =>
                    router.push(`/admin/assessments/${item._id}`)
                  }
                  className="flex items-center gap-1 px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Eye size={14} />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}