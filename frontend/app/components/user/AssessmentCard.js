export default function AssessmentCard({ title, level, topic, score, percent }) {
  return (
    <div className="bg-white text-black p-4 rounded-xl shadow flex justify-between">
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-gray-500">{level} • {topic}</p>
      </div>

      <div className="text-right">
        <p className="font-bold">{score}</p>
        <p className="text-gray-500">{percent}</p>
      </div>
    </div>
  );
}