const express = require("express");
const router = express.Router();

const { addBudget } = require("../Controllers/budgetController");
const protect = require("../Middlewares/authMiddleware");

router.post("/add", protect, addBudget);

module.exports = router;