const express = require("express");
const router = express.Router();

const { userSignup, adminSignup, login } = require("../controllers/authController");

router.post("/signup", userSignup);

module.exports = router;