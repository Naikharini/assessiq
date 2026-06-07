import Link from "next/link";

export default function DashboardSidebar() {
  return (
    <aside className="w-72 p-6">
      {/* Sidebar */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <ul className="space-y-4">

          <li>
            <Link
              href="/user/dashboard"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
            >
              📊 Dashboard
            </Link>
          </li>

          <li>
            <Link
              href="/user/assessment"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
            >
              📝 New Assessment
            </Link>
          </li>

        </ul>
      </div>
    </aside>
  );
}