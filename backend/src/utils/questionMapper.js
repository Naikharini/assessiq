const MAX_QUESTIONS = 5;

const clampQuestionCount = (count) => {
  const n = Number(count) || 3;
  return Math.min(Math.max(n, 1), MAX_QUESTIONS);
};

const letterFromAnswer = (correctAnswer, options = []) => {
  if (!correctAnswer) return "A";
  const upper = String(correctAnswer).trim().toUpperCase();
  if (["A", "B", "C", "D"].includes(upper)) return upper;

  const idx = options.findIndex(
    (opt) => String(opt).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase()
  );
  return idx >= 0 ? ["A", "B", "C", "D"][idx] : "A";
};

const aiToDbQuestions = (aiQuestions = []) =>
  aiQuestions.map((q) => {
    const options = q.options || [];
    const correct = letterFromAnswer(q.correctAnswer, options);

    return {
      question: q.question,
      optionA: options[0] || "",
      optionB: options[1] || "",
      optionC: options[2] || "",
      optionD: options[3] || "",
      correct,
      difficulty: q.difficulty || "Medium",
      points: 1,
    };
  });

const dbToFrontendQuestions = (questions = []) =>
  questions.map((q) => {
    const options = [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean);
    const correctIndex = ["A", "B", "C", "D"].indexOf(q.correct);
    const correctAnswer = correctIndex >= 0 ? options[correctIndex] : options[0];

    return {
      id: q.id,
      question: q.question,
      options,
      correctAnswer,
    };
  });

module.exports = {
  MAX_QUESTIONS,
  clampQuestionCount,
  aiToDbQuestions,
  dbToFrontendQuestions,
};
