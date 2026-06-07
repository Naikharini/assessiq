export default function StatsCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <p className="text-gray-600">{title}</p>
 
      <h2 className="text-4xl font-bold mt-3">
        {value}
      </h2>
 
      <p className="text-gray-400 mt-2">
        {subtitle}
      </p>
    </div>
  );
}