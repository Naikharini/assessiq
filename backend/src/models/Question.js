module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "Question",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      question: DataTypes.TEXT,
      optionA: DataTypes.STRING,
      optionB: DataTypes.STRING,
      optionC: DataTypes.STRING,
      optionD: DataTypes.STRING,
      correct: DataTypes.STRING,
      difficulty: DataTypes.STRING,
      points: DataTypes.INTEGER,
    },
    {
      tableName: "questions",
      timestamps: true,
    }
  );

  return Question;
};