const { Sequelize, DataTypes } = require("sequelize");
const databaseConfig = require("../config/database");

const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: databaseConfig.dialect,
    logging: databaseConfig.logging,
    dialectOptions: databaseConfig.dialectOptions,
    pool: databaseConfig.pool,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require("./User")(sequelize, DataTypes);
db.Admin = require("./Admin")(sequelize, DataTypes);
db.Assessment = require("./Assessment")(sequelize, DataTypes);
db.Question = require("./Question")(sequelize, DataTypes);
db.AssessmentAttempt = require("./AssessmentAttempt")(sequelize, DataTypes);

db.Assessment.hasMany(db.Question, {
  foreignKey: "assessmentId",
  as: "questions",
  onDelete: "CASCADE",
});

db.Question.belongsTo(db.Assessment, {
  foreignKey: "assessmentId",
  as: "assessment",
});

db.User.hasMany(db.AssessmentAttempt, { foreignKey: "userId" });
db.AssessmentAttempt.belongsTo(db.User, { foreignKey: "userId" });

db.Assessment.hasMany(db.AssessmentAttempt, { foreignKey: "assessmentId" });
db.AssessmentAttempt.belongsTo(db.Assessment, { foreignKey: "assessmentId" });

module.exports = db;
