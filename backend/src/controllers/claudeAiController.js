const aiService = require("../services/aiService");

const generateAssessment = async (req, res) => {
    try {
        const { topic, difficulty, numberOfQuestions } = req.body;

        const questions = await aiService.generateQuestions(
            topic,
            difficulty,
            numberOfQuestions
        );

        res.json({
            success: true,
            data: questions
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    generateAssessment
};