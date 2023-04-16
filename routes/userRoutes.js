const express = require("express");
const router = express.Router();
const {
  authenticate,
  authenticateAdmin,
} = require("../middleware/authenticate");

const {
  createUser,
  getUserData,
  updateUser,
  getAllUsers,
  deleteUser,
  updateAdminUser,
} = require("../controllers/userController");

router.post("/create", createUser);
router.get("/user", authenticate, getUserData);
//for users to change their own data
router.put("/user", authenticate, updateUser);
//for admin to edit other users
router.put("/admin/user/:id", authenticateAdmin, updateAdminUser);
router.get("/", getAllUsers);
router.delete("/:id", deleteUser);

module.exports = router;
