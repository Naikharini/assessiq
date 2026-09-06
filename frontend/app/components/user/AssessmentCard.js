export default function AssessmentCard({
  title,
  level,
  topic,
  score,
  percent,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-5 flex justify-between items-center transition ${
        onClick ? "cursor-pointer hover:border-blue-300 hover:shadow-md" : ""
      }`}
    >
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-slate-500 text-sm mt-1">
          {level} • {topic}
        </p>
      </div>
      <div className="text-right">
        <p className="font-bold text-indigo-600 text-lg">{score}</p>
        <p className="text-slate-500 text-sm">{percent}</p>
      </div>
    </div>
  );
}
