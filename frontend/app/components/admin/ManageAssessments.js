"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  Plus,
  X,
  CheckCircle,
} from "lucide-react";
import { apiFetch } from "../../lib/api";

export default function ManageAssessments({ onEdit, onCreateNew }) {
  const [assessments, setAssessments] = useState([]);
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const data = await apiFetch("/api/assessment/all", {}, "admin");
      setAssessments(data.assessments || []);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteAssessment = async (id) => {
    if (!confirm("Delete this assessment?")) return;
    try {
      await apiFetch(`/api/assessment/${id}`, { method: "DELETE" }, "admin");
      fetchAssessments();
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = assessments.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Manage Assessments
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            View, edit and manage published assessments.
          </p>
        </div>

        <button
          onClick={() => onCreateNew?.()}
          className="glass-btn px-5 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={16} />
          Create Assessment
        </button>
      </div>

      {/* Search */}
      <div className="relative w-96">
        <Search size={18} className="absolute left-3 top-3 text-gray-600" />
        <input
          placeholder="Search assessment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-3 w-full border text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Table */}
      <div className="glass-table rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="glass-subtle">
            <tr className="text-left text-sm text-slate-600">
              <th className="px-5 py-4">Assessment</th>
              <th className="px-5 py-4">Difficulty</th>
              <th className="px-5 py-4">Questions</th>
              <th className="px-5 py-4">Duration</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  No Assessments Found
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="border-t hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {item.name}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {item.department}
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                      {item.difficulty}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {item.questions?.length || 0}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {item.duration} min
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                      Published
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      {/* View */}
                      <button
                        onClick={() => setViewItem(item)}
                        title="View Details"
                        className="p-2 rounded-lg hover:bg-slate-200 text-slate-600"
                      >
                        <Eye size={17} />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEdit?.(item)}
                        title="Edit Assessment"
                        className="p-2 rounded-lg hover:bg-yellow-100 text-yellow-600"
                      >
                        <Pencil size={17} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteAssessment(item.id)}
                        title="Delete"
                        className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-slate-500">
        Showing {filtered.length} Assessments
      </div>

      {/* View Modal */}
      {viewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setViewItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-7 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setViewItem(null)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <X size={18} />
            </button>

            {/* Title */}
            <h2 className="text-xl font-bold text-slate-800 mb-1">
              {viewItem.name}
            </h2>
            <p className="text-sm text-slate-500 mb-5">
              {viewItem.description || "No description provided."}
            </p>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                ["Department", viewItem.department],
                ["Difficulty", viewItem.difficulty],
                ["Duration", `${viewItem.duration} min`],
                ["Passing Score", `${viewItem.passingScore}%`],
                ["Questions", viewItem.questions?.length || 0],
                ["Job Role", viewItem.jobRole || "-"],
              ].map(([label, value]) => (
                <div key={label} className="bg-slate-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-slate-700">{value}</p>
                </div>
              ))}
            </div>

            {/* Questions */}
            {viewItem.questions?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Questions ({viewItem.questions.length})
                </h3>
                <div className="space-y-4">
                  {viewItem.questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl p-4"
                    >
                      <p className="text-sm font-medium text-slate-800 mb-3">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {["A", "B", "C", "D"].map((letter) => {
                          const optKey = `option${letter}`;
                          const isCorrect = q.correct === letter;
                          return (
                            <div
                              key={letter}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                                isCorrect
                                  ? "bg-green-50 border border-green-200 text-green-700 font-semibold"
                                  : "bg-slate-50 text-slate-600"
                              }`}
                            >
                              {isCorrect && (
                                <CheckCircle size={12} className="shrink-0" />
                              )}
                              <span className="font-bold mr-1">{letter}.</span>
                              {q[optKey] || <span className="italic text-slate-400">-</span>}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex gap-3 mt-2 text-xs text-slate-400">
                        <span>Difficulty: {q.difficulty}</span>
                        <span>Points: {q.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setViewItem(null)}
                className="px-4 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = viewItem;
                  setViewItem(null);
                  onEdit?.(target);
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
