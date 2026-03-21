const { check, validationResult } = require('express-validator');

// شروط إضافة مصروف جديد
// Expense Validation
const expenseValidation = [
    check('title', 'Title is required').not().isEmpty(),
    check('amount', 'Amount must be a positive number').isNumeric().isFloat({ min: 0.01 }),
    check('category', 'Category is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
// Register Validation
const registerValidation =  [
    check('name', 'Name is require').not().isEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('password', 'password must be 6+ chars').isLength({ min : 6}),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors : errors.array() });
        }
        next();
    }
];

// Login Validation
const loginValidation = [
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors:errors.array() });
        }
        next();
    }
];

// Category Validation
const categoryValidation = [
    check('name', 'Category name is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { expenseValidation, registerValidation, loginValidation, categoryValidation };