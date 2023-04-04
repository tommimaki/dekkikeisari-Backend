const User = require("../models/user");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      name: name || "",
      email: email,
      password: hashedPassword,
      address: address || "",
      role: role || "customer",
    };

    await User.create(newUser);

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
