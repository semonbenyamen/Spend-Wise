const express = require("express");
const router = express.Router();

//عشان اربط ال validator هنا  
const { expenseValidation } = require('../Middlewares/validator');


const { addExpense, getExpenses, deleteExpense, updateExpense} = require("../Controllers/expenseController");
// حماية الروتات دي عشان بس المستخدمين المسجلين يقدروا يوصلوا لها
const protect = require("../Middlewares/authMiddleware"); 

// روت إضافة مصروف (لازم يكون المستخدم مسجل دخول)
router.post("/add", protect, addExpense);

// روت عرض المصاريف (GET)
router.get("/all", protect, getExpenses);
router.delete("/delete/:id", protect, deleteExpense);
router.put("/update/:id", protect, updateExpense);
router.post("/add", protect, expenseValidation, addExpense);

// router.get("/total", protect, getTotalExpenses);
module.exports = router;