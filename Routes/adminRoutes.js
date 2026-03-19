const express = require("express");
const router = express.Router();

const protect = require("../Middlewares/authMiddleware");
const isAdmin = require("../Middlewares/adminMiddleware");

const { getAllUsers, getAllExpenses, getSystemAnalytics } = require("../Controllers/adminController");

router.get("/users", protect, isAdmin, getAllUsers);
router.get("/expenses", protect, isAdmin, getAllExpenses);
router.get("/analytics", protect, isAdmin, getSystemAnalytics);

module.exports = router;