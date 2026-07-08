const anthropic = require("../../config/claude");

const generateQuestions = async (
    topic,
    difficulty,
    numberOfQuestions
) => {

    const prompt = `
You are an expert technical interviewer.

Generate exactly ${numberOfQuestions} multiple-choice questions.

Topic: ${topic}
Difficulty: ${difficulty}

Rules:
- Each question must have 4 options
- Only ONE correct answer
- Include explanation
- No duplicates
- Return ONLY valid JSON (no markdown, no text)

JSON format:
{
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "correctAnswer": "",
      "explanation": ""
    }
  ]
}
`;

    const response = await anthropic.messages.create({
  model: "claude-3-5-haiku-20241022",
  max_tokens: 2000,
  temperature: 0.2,
  messages: [
    {
      role: "user",
      content: prompt
    }
  ]
});

    let text = response.content[0].text;

    try {
        return JSON.parse(text);
    } catch (err) {
        console.log("Raw AI Response:", text);

        // fallback: extract JSON only
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}");

        if (jsonStart !== -1 && jsonEnd !== -1) {
            const cleanJson = text.substring(jsonStart, jsonEnd + 1);
            return JSON.parse(cleanJson);
        }

        throw new Error("Invalid JSON response from Claude");
    }
};

module.exports = {
    generateQuestions
};