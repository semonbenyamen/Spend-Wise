const express = require("express");
const router = express.Router();

const {createCategory, getCategories, deleteCategory, updateCategory} = require ("../Controllers/categoryController");
// can only user who is make log in use it
const protect = require("../Middlewares/authMiddleware");

router.post("/add", protect, createCategory);
router.get("/all", protect, getCategories);
router.delete("/delete/:id", protect, deleteCategory);
router.put("/update/:id", protect, updateCategory);

module.exports = router;