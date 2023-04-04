const express = require("express");
const { sign } = require("jsonwebtoken");
const router = express.Router();

const { loginUser } = require("../controllers/AuthController");

router.post("/login", loginUser);

module.exports = router;
