const Category = require ("../Models/Category");
const Expense = require("../Models/Expense")

const createCategory = async (req, res, next)=> {
    try {
    //take name from body
        const {name} = req.body;    
        const category = await Category.create ({
            name,
            user: req.user.id
        });
        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

const getCategories = async (req, res, next) => {
    try {
    // search for category by user id
        const categories = await Category.find({user : req.user.id});
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch(err) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
    // search about category by ID    
        const category = await Category.findById(req.params.id);
    //if not found    
        if(!category) {
            return res.status(404).json({ msg : "Category not found"});
        }

        if(category.user.toString() !== req.user.id) {
            return res.status(401).json({ msg : "Not authorized"});
        }
   // If there are any expenses in the category do not delete them
   const expenses = await Expense.find({category: category._id});
   if(expenses.length > 0 ){
    return res.status(400).json({
        msg : "Cannot delete category because it has expenses"
    });

   }
   await category.deleteOne();
        res.status(200).json({
            success : true,
            msg : "Category deleted"
        });

    } catch (err) {
        next(error);
    }
};


const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if(!category) {
            return res.status(404).json({ msg : "Category not found"});
        }

        if(category.user.toString() !== req.user.id) {
            return res.status(401).json({ msg : "Not authorized"});
        }
    // if user put a new name or category ok and change it 
    // if not leave the old name as is
        category.name = req.body.name || category.name;
        await category.save();

        res.status(200).json({
            success : true,
            data : category
        });
    } catch (err) {
        next(error);
    }
};


module.exports = {createCategory, getCategories, deleteCategory, updateCategory};