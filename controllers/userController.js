const User = require("../models/user");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(req.body);

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({ email, hashedPassword, role });

    logger.info("User created successfully");
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    logger.error(`Error creating user: ${error}`);
    res.status(500).json({ message: "Failed to create user" });
  }
};

module.exports = {
  createUser,
};
