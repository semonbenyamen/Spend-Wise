const express =require('express');
const router = express.Router();

const {registerUser, loginUser, getUserProfile} = require("../Controllers/authController");
const {registerValidation, loginValidation } = require("../Middlewares/validator");

// Register route
router.post("/register",registerValidation, registerUser);
// Login route
router.post("/login", loginValidation, loginUser);

// Middleware 
const protect = require("../Middlewares/authMiddleware");
// Profile route
router.get("/profile", protect, getUserProfile);

module.exports = router;


