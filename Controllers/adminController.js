const User = require("../Models/User"); 
const Expense = require("../Models/Expense");

const getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getAllExpenses = async(req, res) => {
    try {
        const expenses = await Expense.find()
        // get user is data not ID
        .populate("user", "name email")
        // get category name not ID
        .populate("category", "name");

        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getSystemAnalytics = async(req,res) => {
    try {
        // Total expenses
        const totalExpenses = await Expense.aggregate([
            {
                // It adds all expenses into one number
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        // Most used category with names
        const topCategories = await Expense.aggregate([
            {
                // It collects expenses According to category.
                   $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
            }
        },
        {
            $sort: { total: -1 }
        },
        {
            $limit: 3
        },
        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                as: "categoryInfo"
            }
        },
            {
                $unwind: "$categoryInfo"
                },
                {
                    $project: {
                        _id: 0,
                        category: "$categoryInfo.name",
                        total: 1
                    }
                }
        ]);
        // Most Spending Users $
        const topUsers = await Expense.aggregate([
            {
                $group: {
                    _id: "$user",
                    total: { $sum: "$amount" } 
                }
            },
            {
                $sort: { total: -1 }
            },
            {
                $limit: 3
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            {
                $project: {
                    _id: 0,
                    user: "$userInfo.name",
                    total: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalExpenses: totalExpenses[0]?.total || 0,
                topCategories,
                topUsers
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message
        });
    }
}

module.exports = { getAllUsers, getAllExpenses, getSystemAnalytics };

