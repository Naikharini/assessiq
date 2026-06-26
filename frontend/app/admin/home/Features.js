import {
  Users,
  BarChart3,
  Settings,
  Eye,
  FileEdit,
  Filter,
  Trash2,
} from "lucide-react";


import Link from "next/link";
export default function AdminFeatures() {
  const features = [
    {
      icon: <Eye size={20} />,
      title: "View All Assessments",
      description:
        "Access complete details of every assessment taken by all users.",
    },
    {
      icon: <FileEdit size={20} />,
      title: "Edit & Modify",
      description:
        "Update assessment content, questions and configurations.",
    },
    {
      icon: <Filter size={20} />,
      title: "Advanced Filtering",
      description:
        "Search and filter assessments by skill, difficulty and date.",
    },
    {
      icon: <Trash2 size={20} />,
      title: "Delete Management",
      description:
        "Remove assessments and manage retention policies.",
    },
  ];

  return (
    <>
      {/* Top Feature Cards */}
      <section className="max-w-7xl mx-auto px-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <Users />
          </div>

          <h3 className="mt-4 text-xl text-gray-900 font-semibold">
            User Management
          </h3>

          <p className="mt-2 text-gray-600">
            View all registered users, monitor their activity and engagement.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <BarChart3 />
          </div>

          <h3 className="mt-4 text-xl text-gray-900 font-semibold">
            Analytics & Insights
          </h3>

          <p className="mt-2 text-gray-600">
            Track scores, completion rates and performance trends.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <Settings />
          </div>

          <h3 className="mt-4 text-xl text-gray-900 font-semibold">
            Assessment Control
          </h3>

          <p className="mt-2 text-gray-600">
            Manage and review all assessments.
          </p>
        </div>
      </section>

      {/* Admin Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="rounded-3xl bg-blue-50 p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* Left Side */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Admin Features
              </h2>

              <p className="mt-4 text-gray-600">
                Everything you need to manage and monitor your platform.
              </p>

              <div className="mt-8 space-y-6">
                {features.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow">
                      {item.icon}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {item.title}
                      </h4>

                      <p className="text-gray-600 text-sm mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Stats */}
<div className="bg-white rounded-2xl shadow-lg p-6">
  <div className="flex justify-between mb-6">
    <h3 className="font-semibold text-gray-900 text-lg">
      Platform Statistics
    </h3>

    <span className="text-sm text-gray-500">
      Live Dashboard
    </span>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div className="rounded-xl bg-gray-100 p-4">
      <p className="text-gray-500 text-sm">Total Users</p>
      <h4 className="text-3xl font-bold text-blue-600">3</h4>
    </div>

    <div className="rounded-xl bg-gray-100 p-4">
      <p className="text-gray-500 text-sm">Assessments</p>
      <h4 className="text-3xl font-bold text-blue-600">5</h4>
    </div>

    <div className="rounded-xl bg-gray-100 p-4">
      <p className="text-gray-500 text-sm">Avg. Score</p>
      <h4 className="text-3xl font-bold text-blue-600">78%</h4>
    </div>

    <div className="rounded-xl bg-gray-100 p-4">
      <p className="text-gray-500 text-sm">Active Today</p>
      <h4 className="text-3xl font-bold text-blue-600">2</h4>
    </div>
  </div>

  <Link
  href="/admin/login"
  className="mt-6 block w-full text-center rounded-lg bg-blue-600 py-3 text-white font-medium hover:bg-blue-700"
>
  Login to Admin Panel
</Link>
</div>
          </div>
        </div>
      </section>
    </>
  );
}