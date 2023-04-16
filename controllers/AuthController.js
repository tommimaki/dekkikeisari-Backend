const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { findByEmail } = require("../models/user");
const logger = require("../utils/logger");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, "secret-key", {
      expiresIn: "1h",
    });

    res.json({ token });
    logger.info(` ${email} logged in  successfully`);
  } catch (error) {
    console.error(`Error during login: ${error}`);
    res.status(500).json({ message: "Error during login" });
  }
};

module.exports = {
  loginUser,
};
