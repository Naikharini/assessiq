const bcrypt = require("bcryptjs");
const db = require("../../models");

const User = db.User;

// ================= USER SIGNUP =================
const userSignup = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    if (!User) {
      return res.status(500).json({
        success: false,
        message: "User model not loaded"
      });
    }

    const existing = await User.findOne({ where: { email } });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user"
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user
    });

  } catch (error) {
    console.log("USER SIGNUP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= ADMIN SIGNUP =================
const adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      user: admin
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "Login working"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  userSignup,
  adminSignup,
  login
};