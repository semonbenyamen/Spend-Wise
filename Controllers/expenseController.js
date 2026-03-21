const Expense = require("../Models/Expense");
const mongoose = require("mongoose");
const Budget = require("../Models/Budget");
// إضافة مصروف جديد
const addExpense = async (req, res, next) => {
    try {
        const { title, amount, category } = req.body;

        // ملاحظة: الـ req.user.id بتيجي من الـ Auth Middleware اللي هنعمله
        const expense = await Expense.create({
            title,
            amount,
            category,
            user: req.user.id 
        });

// Expense By Aggregate
// get this is month and year (Current)
const month = new Date().getMonth() +1;
const year = new Date().getFullYear();

// Calculate total expenses for the current month
const totalSpentAggregate = await Expense.aggregate([
// Filter for expenses and makesure the expenses is current month only
    { $match: {
        user: new mongoose.Types.ObjectId(req.user.id),
        createdAt: {
            $gte: new Date(year, month-1,1),
            $lt: new Date(year, month, 1)
        }
    }},
    // $group : to get all data/_id: null: to get all expenses
    { $group: { _id: null, total: { $sum: "$amount" }}}
]);

// If there expenses get the total If no expenses give 0
const totalSpent = totalSpentAggregate[0]?.total || 0;


//Alert System

const budget = await Budget.findOne({ user: req.user.id, month, year });

if (!budget) return res.status(400).json({ msg : "No budget set for this month"});

let alertMessage = null;
// for alert of 100% 
// !== to not sent the same notification more than once
if (totalSpent >= budget.amount && budget.alertSent !== "max") {
    alertMessage = "You have reached 100% of your monthly budget!";
    budget.alertSent = "max";
    await budget.save();
// for alert of 80%    
} else if ( totalSpent >= budget.amount * 0.8 && budget.alertSent === "none") {
    alertMessage = " Warning! You have spent 80% of your monthly budget.";
    budget.alertSent = "warning";
    await budget.save();

} else if (totalSpent > budget.amount){
    alertMessage = "You already exceeded your monthly budged";
}

        res.status(201).json({
            success: true,
            message: alertMessage,
            data: expense
        });
        
    } catch (error) {
        next(error);
    }
};







// عرض كل مصاريف المستخدم الحالي
const getExpenses = async (req, res, next) => {
    try {
        // بنبحث عن المصاريف اللي الـ user ID بتاعها بيساوي ID الشخص اللي عامل login
        const expenses = await Expense.find({ user: req.user.id })
        .populate("category", "name")
      // sort للترتيب 
        .sort({ date : -1 });

        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });
    } catch (error) {
        next(error);
    }
};

// مسح مصروف معين
const deleteExpense = async (req, res, next) => {
    try {
        // 1. البحث عن المصروف بالـ ID المبعوث في الرابط
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ msg: "The expense does not exist" });
        }

        // 2. التأكد إن المصروف ده يخص اليوزر اللي عامل Login
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "You are not allowed to delete this expense" });
        }

        await expense.deleteOne();
        res.json({ success: true, msg: "The expense was successfully cleared" });
    } catch (error) {
        next(error);
    }
};



// تعديل مصروف معين
const updateExpense = async (req, res, next) => {
    try {
        let expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ msg: "The expense does not exist" });
        }

        // التأكد إن المصروف يخص اليوزر اللي عامل Login
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "You are not allowed to edit this expense" });
        }

        // التحديث بالبيانات الجديدة المبعوتة في الـ Body
        expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
        // عشان يرجع لنا المصروف بعد التعديل
            new: true, 
        // عشان يتأكد إن البيانات الجديدة مطابقة للـ Schema    
            runValidators: true 
        });

        res.json({ success: true, data: expense });
    } catch (error) {
        next(error);
    }
};

// Features Dashboard Category

const getExpensesByCategory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await Expense.aggregate([
            {
                $match: { 
                    user: new mongoose.Types.ObjectId(userId)
                 },
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" },
                },
            },
        ]);
        res.status(200).json({
            success : true,
            data,
        });

    } catch (error) {
        next(error);
    }
};

// Features Monthly Reports
const getMonthlyReport = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await Expense.aggregate([
            {
                // User expenses
                $match: {
                     user: new mongoose.Types.ObjectId(userId) 
                    },
            },
            {
                // add month by date
               $addFields: {
                month: { $month: "$createdAt" },
                
            },
        },
        {
            $group: {
                _id: "$month",
                total: { $sum: "$amount" },
            },
        },
        {
            // ترتيب
            $sort: { _id: 1 },
        },
        ]);

        res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {
        next(error);
    }
    
};

module.exports = { addExpense, getExpenses, deleteExpense, updateExpense, getExpensesByCategory, getMonthlyReport };

