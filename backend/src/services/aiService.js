const anthropic = require("../../config/claude");
const { clampQuestionCount } = require("../utils/questionMapper");

const MODEL =
  process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

const MOCK_TEMPLATES = [
  {
    question: (skill, topic) =>
      `Which statement best describes ${topic} in ${skill}?`,
    options: (skill, topic) => [
      `A core concept used when working with ${topic}`,
      `An unrelated database feature in ${skill}`,
      `A deprecated syntax with no practical use`,
      `A styling-only concern with no logic impact`,
    ],
    correctIndex: 0,
  },
  {
    question: (skill, topic) =>
      `What is a common best practice for ${topic} in ${skill}?`,
    options: () => [
      "Follow established patterns and keep code predictable",
      "Ignore error handling to improve performance",
      "Duplicate logic across every module",
      "Avoid testing edge cases entirely",
    ],
    correctIndex: 0,
  },
  {
    question: (skill, topic) =>
      `In ${skill}, ${topic} is primarily used to:`,
    options: (skill, topic) => [
      `Solve practical problems related to ${topic}`,
      `Replace all other language features`,
      `Disable compiler optimizations`,
      `Remove the need for documentation`,
    ],
    correctIndex: 0,
  },
  {
    question: (skill, topic) =>
      `Which option is most likely a ${topic} mistake in ${skill}?`,
    options: () => [
      "Misusing APIs or patterns without understanding behavior",
      "Writing readable and maintainable code",
      "Handling invalid input safely",
      "Separating concerns into reusable modules",
    ],
    correctIndex: 0,
  },
  {
    question: (skill, topic, difficulty) =>
      `For ${difficulty} ${topic} questions in ${skill}, you should focus on:`,
    options: (skill, topic) => [
      `Understanding how ${topic} works in real ${skill} scenarios`,
      "Memorizing syntax without context",
      "Avoiding official documentation",
      "Using only one fixed coding style",
    ],
    correctIndex: 0,
  },
];

function generateMockQuestions(skill, topic, difficulty, numberOfQuestions) {
  const count = clampQuestionCount(numberOfQuestions);

  return {
    questions: Array.from({ length: count }, (_, index) => {
      const template = MOCK_TEMPLATES[index % MOCK_TEMPLATES.length];
      const options = template.options(skill, topic, difficulty);
      const correctAnswer = options[template.correctIndex];

      return {
        question: template.question(skill, topic, difficulty),
        options,
        correctAnswer,
      };
    }),
  };
}

function getApiErrorMessage(err) {
  const message = err?.error?.error?.message || err?.message || "AI request failed";

  if (/credit balance is too low/i.test(message)) {
    return "Anthropic API credits are exhausted. Add credits at console.anthropic.com or set MOCK_AI=true in backend/.env for local testing.";
  }

  if (/invalid x-api-key|authentication/i.test(message)) {
    return "Invalid Anthropic API key. Check ANTHROPIC_API_KEY in backend/.env.";
  }

  return message;
}

const generateQuestions = async (skill, topic, difficulty, numberOfQuestions) => {
  const count = clampQuestionCount(numberOfQuestions);

  if (process.env.MOCK_AI === "true") {
    return generateMockQuestions(skill, topic, difficulty, count);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is missing. Add it to backend/.env or set MOCK_AI=true for local testing."
    );
  }

  const topicText = topic ? ` Topic: ${topic}.` : "";

  const prompt = `Generate ${count} MCQs for ${skill}.${topicText} Difficulty: ${difficulty}.
4 options each, one correct. JSON only:
{"questions":[{"question":"...","options":["a","b","c","d"],"correctAnswer":"exact option text"}]}`;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: Math.min(150 * count + 100, 800),
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].text;

    try {
      return JSON.parse(text);
    } catch (err) {
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");

      if (jsonStart !== -1 && jsonEnd !== -1) {
        return JSON.parse(text.substring(jsonStart, jsonEnd + 1));
      }

      throw new Error("Invalid JSON response from Claude");
    }
  } catch (err) {
    const friendlyMessage = getApiErrorMessage(err);
    const apiError = new Error(friendlyMessage);
    apiError.statusCode = err?.status || 502;
    throw apiError;
  }
};

module.exports = { generateQuestions };
