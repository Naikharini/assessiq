const bcrypt = require("bcrypt");
const { Admin } = require("../../models");

exports.signup = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({
      where: { email }
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const admin = await Admin.findOne({
      where: { email }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    const match = await bcrypt.compare(
      password,
      admin.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    res.json({
      success: true,
      message: "Admin login successful",
      admin
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};