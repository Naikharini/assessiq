const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateMCQs = async ({ skill, count, difficulty }) => {
  const prompt = `
Generate ${count} MCQ questions for the skill: ${skill}
Difficulty level: ${difficulty}

Return ONLY valid JSON in this format:

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
  });

  return JSON.parse(response.choices[0].message.content);
};

module.exports = { generateMCQs };