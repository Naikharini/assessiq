const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

exports.generateAssessment = async (req, res) => {
  try {
    const { skill, topic, difficulty, questionCount } = req.body;

    if (!skill || !topic || !difficulty || !questionCount) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const prompt = `
Generate ${questionCount} MCQ questions.

Rules:
- Skill: ${skill}
- Topic: ${topic}
- Difficulty: ${difficulty}
- Each question must have 4 options
- Only ONE correct answer
- Options must be realistic and related to topic
- No generic placeholders

Return ONLY valid JSON:

[
  {
    "question": "",
    "options": ["", "", "", ""],
    "correctAnswer": "",
    "explanation": ""
  }
]
`;

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 3000,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let content = response.content[0].text;

    content = content.replace(/```json/g, "").replace(/```/g, "");

    const questions = JSON.parse(content);

    return res.status(200).json({
      success: true,
      questions,
    });

  } catch (error) {
    console.error("Claude Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};