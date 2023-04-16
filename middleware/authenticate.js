const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secret-key");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Auth Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token:", token);

  try {
    const decoded = jwt.verify(token, "secret-key");
    console.log("Decoded Token:", decoded); // Log the decoded token value
    const user = await User.findById(decoded.userId);
    console.log("User:", user); // Log the user object
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Error in authenticateAdmin:", error); // Log the error
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authenticate, authenticateAdmin };
