export default function Stats() {
  return (
    <section className="max-w-6xl px-6 mx-auto mb-20">
      <div className="p-8 border bg-slate-50 rounded-2xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-800">
          Platform Statistics
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="p-5 bg-white rounded-xl">
            <h3 className="text-2xl font-bold text-blue-600">3</h3>
            <p className="text-sm text-slate-500">Users</p>
          </div>

          <div className="p-5 bg-white rounded-xl">
            <h3 className="text-2xl font-bold text-blue-600">5</h3>
            <p className="text-sm text-slate-500">Assessments</p>
          </div>

          <div className="p-5 bg-white rounded-xl">
            <h3 className="text-2xl font-bold text-blue-600">78%</h3>
            <p className="text-sm text-slate-500">Average Score</p>
          </div>

          <div className="p-5 bg-white rounded-xl">
            <h3 className="text-2xl font-bold text-blue-600">2</h3>
            <p className="text-sm text-slate-500">Active Users</p>
          </div>
        </div>
      </div>
    </section>
  );
}