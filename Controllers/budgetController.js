const Budget = require("../Models/Budget");
const Expense = require("../Models/Expense");


//Setting a monthly budget
const addBudget = async(req, res, next) => {
    try {
        // take amount from user
        const { amount } = req.body;
        const userId =req.user.id;
// Knowing the current month
        const month = new Date().getMonth() +1;
        const year = new Date().getFullYear();
// Search if the user has set a budget for this month.
        let budget = await Budget.findOne({
            user: req.user.id,
            month,
            year
        });
// if budget is available Edit it
        if (budget) {
            budget.amount = amount;
            await budget.save();
        }
// create new budget
        else {
            budget = await Budget.create({
                user: req.user.id,
                amount,
                month, 
                year
            });
        }

        res.status(200).json({
            success : true,
            data : budget
        });

    } catch (err) {
       next(error);
    }
};


const getBudgetStatus = async (req, res, next) => {
    try {
        const userId = req.user.id; 
      // for Currently month and year
        const month = new Date().getMonth() +1;
        const year = new Date().getFullYear();
     // to get budget
        const budget = await Budget.findOne({ user : userId, month, year });

        if (!budget) {
            return res.status(404).json({ message : "NO budget set" });
        }
        // calculate the total expenses
            const expenses = await Expense.aggregate([
                {
                    $match: {
                        user: budget.user,
                        createdAt: {
                            $gte: new Date(year, month -1, 1),
                            $lte: new Date(year, month, 0),
                        },
                    },
                }, 
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" },
                    },
                },
            ]);
        // for totalSpent if no expenses it will Be 0
            const totalSpent = expenses[0]?.total || 0;
        // calculate the remainder
            const remaining = budget.amount - totalSpent;
        // calculate the percentage %
            const percentage = (totalSpent / budget.amount ) * 100;
            
            res.json({
                budget: budget.amount,
                totalSpent,
                remaining,
                percentage: percentage.toFixed(2),
                alert: budget.alertSent,
            });
        } catch (error) {
            next(error);
        }
    };



module.exports = { addBudget, getBudgetStatus };