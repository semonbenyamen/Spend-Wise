const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    // 1: عنوان المصروف (مثلاً: غداء، بنزين، إيجار)
    title: {
        type: String,
        required: [true, "Please add a title"],
        trim: true
    },
    // 2: المبلغ
    amount: {
        type: Number,
        required: [true, "Please add an amount"],
        min: [1, "Amount must be at least 1"]
    },
    // 3: التصنيف (Category)
    category: {
        type: String,
        required: [true, "Please select a category"],
        enum: ["Food", "Transport", "Bills", "Entertainment", "Health", "Other"]
    },
    // 4: الربط بالمستخدم (الـ Relationship اللي اتكلمنا عنها)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // لازم يكون نفس الاسم اللي في موديل الـ User
        required: true
    },
    // 5: التاريخ
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);