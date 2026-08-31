const path = require("path");
const fs = require("fs");

require("dotenv").config({
  path: path.join(__dirname, "../../.env"),
});

const configPath = path.join(__dirname, "../../config/config.json");
const fileConfig = fs.existsSync(configPath)
  ? require(configPath).development
  : {};

const database = {
  database: process.env.DB_NAME || fileConfig.database || "assessiq",
  username: process.env.DB_USER || fileConfig.username || "postgres",
  password: process.env.DB_PASSWORD ?? fileConfig.password ?? "",
  host: process.env.DB_HOST || fileConfig.host || "127.0.0.1",
  port: Number(process.env.DB_PORT || fileConfig.port || 5432),
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    connectTimeout: 10000,
  },
  pool: {
    max: 5,
    acquire: 30000,
    idle: 10000,
  },
};

if (!process.env.DB_NAME && !fileConfig.database) {
  console.warn(
    "Database config: using defaults. Create backend/.env or update config/config.json."
  );
}

module.exports = database;
