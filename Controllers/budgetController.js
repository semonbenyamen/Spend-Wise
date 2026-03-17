const Budget = require("../Models/Budget");

//Setting a monthly budget
const addBudget = async(req, res) => {
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
        res.status(500).json({
            success : false,
            message : err.message
        });
    }
};

module.exports = { addBudget };