const db = require("./models");

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("PostgreSQL connected successfully");
  })
  .catch((err) => {
    console.error("Database Error:", err);
  });

module.exports = db;