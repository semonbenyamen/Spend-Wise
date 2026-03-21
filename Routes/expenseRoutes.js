const express = require("express");
const router = express.Router();

//عشان اربط ال validator هنا  
const { expenseValidation } = require('../Middlewares/validator');


const { addExpense, getExpenses, deleteExpense, updateExpense, getExpensesByCategory, getMonthlyReport } = require("../Controllers/expenseController");
// حماية الروتات دي عشان بس المستخدمين المسجلين يقدروا يوصلوا لها
const protect  = require("../Middlewares/authMiddleware"); 

// روت عرض المصاريف (GET)
router.post("/add", protect, expenseValidation, addExpense);
router.get("/all", protect, getExpenses);
router.delete("/delete/:id", protect, deleteExpense);
router.put("/update/:id", protect, updateExpense);
router.get("/monthly-report", protect, getMonthlyReport);
router.get("/by-category", protect, getExpensesByCategory);


module.exports = router;