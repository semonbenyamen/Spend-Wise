const express =require('express');
const router = express.Router();

const {registerUser, loginUser, getUserProfile} = require("../Controllers/authController");

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);


// Middleware 
const protect = require("../Middlewares/authMiddleware");
// Profile route
router.get("/profile", protect, getUserProfile);

module.exports = router;


