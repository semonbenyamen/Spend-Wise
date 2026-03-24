const express =require('express');
const router = express.Router();

const {registerUser, loginUser, getUserProfile, updateProfile } = require("../Controllers/authController");
const {registerValidation, loginValidation } = require("../Middlewares/validator");
// Middleware 
const protect = require("../Middlewares/authMiddleware");

const upload = require("../Middlewares/uploads");

// Register route
router.post("/register",registerValidation, registerUser);
// Login route
router.post("/login", loginValidation, loginUser);
// Profile route
router.get("/profile", protect, getUserProfile);
// Profile route
router.put("/profile/update", protect, upload.single("profileImage"), updateProfile);

module.exports = router;

