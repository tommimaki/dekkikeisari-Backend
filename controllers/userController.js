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

const getUserData = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      address: user.address,
      role: user.role,
    };

    res.json(userData);
  } catch (error) {
    console.error(`Error fetching user data: ${error}`);
    res.status(500).json({ message: "Error fetching user data" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, address, role } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only update fields that are provided in the request body
    const updatedData = {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(address ? { address } : {}),
      ...(role ? { role } : {}),
    };
    await User.update(userId, updatedData);

    const updatedUser = await User.findById(userId); // Fetching the updated user data
    logger.info("User updated successfully", updatedUser.name);
    res.status(200).json(updatedUser); // Sending the updated user data in the response
  } catch (error) {
    logger.error(`Error updating user: ${error}`);
    res.status(500).json({ message: "Failed to update user" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.status(200).json({ users });
  } catch (error) {
    logger.error(`Error fetching users: ${error}`);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.delete(userId);

    logger.info("User deleted successfully");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting user: ${error}`);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = {
  createUser,
  getUserData,
  updateUser,
  getAllUsers,
  deleteUser,
};
