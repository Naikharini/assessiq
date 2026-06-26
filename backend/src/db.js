const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "assessiq",
  password: "postgres123",
  port: 5432,
});

pool.query("SELECT NOW()")
  .then(() => {
    console.log("✅ PostgreSQL connected successfully");
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err.message);
  });

module.exports = pool;