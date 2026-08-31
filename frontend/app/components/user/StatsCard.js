export default function StatsCard({ title, value, subtitle }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h2 className="text-4xl font-bold mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        {value}
      </h2>
      <p className="text-slate-400 mt-2 text-sm">{subtitle}</p>
    </div>
  );
}
