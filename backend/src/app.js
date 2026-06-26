const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

/* Middleware */
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Test Route */
app.get("/", (req, res) => {
  res.send("AssessIQ Backend Running");
});

/* Routes */
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

/* Start Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});