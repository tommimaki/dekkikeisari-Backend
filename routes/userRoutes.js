const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

const {
  createUser,
  getUserData,
  updateUser,
  getAllUsers,
} = require("../controllers/userController");

router.post("/create", createUser);
router.get("/user", authenticate, getUserData);
router.put("/user", authenticate, updateUser);
router.get("/", getAllUsers);

module.exports = router;
