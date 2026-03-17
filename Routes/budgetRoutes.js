const express = require("express");
const router = express.Router();

const { addBudget, getBudgetStatus } = require("../Controllers/budgetController");
const protect = require("../Middlewares/authMiddleware");

router.post("/add", protect, addBudget);
router.get("/status", protect, getBudgetStatus);
router.get("/by-category", protect, getBudgetStatus);

module.exports = router;