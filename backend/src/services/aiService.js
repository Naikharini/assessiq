const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateMCQs = async ({ skill, count, difficulty }) => {
  const prompt = `
You are an AI that generates exam questions.

Generate ${count} multiple-choice questions for:

Skill: ${skill}
Difficulty: ${difficulty}

Rules:
- Return ONLY valid JSON
- No explanations
- No markdown
- Each question must have 4 options
- Only one correct answer

Format:
[
  {
    "question": "",
    "options": ["A", "B", "C", "D"],
    "answer": ""
  }
]
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return JSON.parse(response.choices[0].message.content);
};

module.exports = { generateMCQs };