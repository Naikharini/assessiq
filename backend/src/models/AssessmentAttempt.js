module.exports = (sequelize, DataTypes) => {
  const AssessmentAttempt = sequelize.define(
    "AssessmentAttempt",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assessmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      answers: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      correctCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      totalQuestions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      percentage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "completed",
      },
      completedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "assessment_attempts",
      timestamps: true,
    }
  );

  return AssessmentAttempt;
};
