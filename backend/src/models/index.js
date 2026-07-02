const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require("./User")(sequelize, DataTypes);
db.Admin = require("./Admin")(sequelize, DataTypes);
db.Assessment = require("./Assessment")(sequelize, DataTypes);
db.Question = require("./Question")(sequelize, DataTypes);


db.Assessment.hasMany(db.Question, {
  foreignKey: "assessmentId",
  as: "questions",
  onDelete: "CASCADE",
});

db.Question.belongsTo(db.Assessment, {
  foreignKey: "assessmentId",
  as: "assessment",
});

module.exports = db;