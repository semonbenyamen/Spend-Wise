const Expense = require("../Models/Expense");

// إضافة مصروف جديد
const addExpense = async (req, res) => {
    try {
        const { title, amount, category } = req.body;

        // ملاحظة: الـ req.user.id بتيجي من الـ Auth Middleware اللي هنعمله
        const expense = await Expense.create({
            title,
            amount,
            category,
            user: req.user.id 
        });

        res.status(201).json({
            success: true,
            data: Expense
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// عرض كل مصاريف المستخدم الحالي
const getExpenses = async (req, res) => {
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
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// مسح مصروف معين
const deleteExpense = async (req, res) => {
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
        res.status(500).json({ success: false, msg: "Server Error" });
    }
};



// تعديل مصروف معين
const updateExpense = async (req, res) => {
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
        res.status(500).json({ success: false, msg: "Server Error" });
    }
};

// const getTotalExpenses = async(req, res) => {
//     try {
//         const result = await Expense.aggregate([
//             {
//                 // Take only the current user's expenses
//                 $match : { user : req.user.id }
//             },
//             {
//                 // add all amount 
//                 $group : {
//                     _id : null,
//                     total : { $sum : "$amount" }
//                 }
//             }
//         ]);
//         res.status(200).json({
//             seccess : true,
//             total : result[0]?.total || 0
//         });
//     } catch (err) {
//         res.status(500).json({ msg : err.message});
//     }
// }

module.exports = { addExpense, getExpenses, deleteExpense, updateExpense, };

