const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const aiRoutes = require("./routes/aiRoutes");
const attemptRoutes = require("./routes/attemptRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("AssessIQ Backend Running");
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/attempts", attemptRoutes);

const PORT = process.env.PORT || 5000;

db.sequelize
  .authenticate()
  .then(() => db.sequelize.sync({ alter: true }))
  .then(() => {
    console.log("PostgreSQL connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database Error:", err.message);
    console.error(
      "Fix: ensure PostgreSQL is running, create database 'assessiq', and set backend/.env (see .env.example)."
    );
    process.exit(1);
  });