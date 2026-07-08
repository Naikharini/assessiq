module.exports = (sequelize, DataTypes) => {
  const Assessment = sequelize.define(
    "Assessment",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: DataTypes.STRING,
      jobRole: DataTypes.STRING,
      department: DataTypes.STRING,
      difficulty: DataTypes.STRING,
      duration: DataTypes.INTEGER,
      passingScore: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      instructions: DataTypes.TEXT,
      scheduleDate: DataTypes.DATE,
      assignTo: DataTypes.STRING,
    },
    {
      tableName: "assessments",
      timestamps: true,
    }
  );

  return Assessment;
};