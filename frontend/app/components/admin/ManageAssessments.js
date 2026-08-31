"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { apiFetch } from "../../lib/api";

export default function ManageAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [search, setSearch] = useState("");

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

        <button className="glass-btn px-5 py-2 rounded-xl flex items-center gap-2">

          <Plus size={16} />

          Create Assessment

        </button>

      </div>

      {/* Search */}

      <div className="relative w-96">

        <Search
          size={18}
          className="absolute left-3 top-3 text-gray-600"
        />

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

                <td
                  colSpan={7}
                  className="text-center py-10 text-gray-400"
                >
                  No Assessments Found
                </td>

              </tr>

            ) : (

              filtered.map((item) => (

                <tr
                  key={item.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-5 py-4 font-medium text-slate-800">
                    {item.name}
                  </td>

                  <td className="px-5 py-4">
                    {item.department}
                  </td>

                  <td className="px-5 py-4">

                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">

                      {item.difficulty}

                    </span>

                  </td>

                  <td className="px-5 py-4">
                    {item.questions?.length || 0}
                  </td>

                  <td className="px-5 py-4">
                    {item.duration} min
                  </td>

                  <td className="px-5 py-4">

                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">

                      Published

                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-center gap-2">

                      <button
                        className="p-2 rounded-lg hover:bg-slate-200"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        className="p-2 rounded-lg hover:bg-yellow-100 text-yellow-600"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => deleteAssessment(item.id)}
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

    </div>
  );
}