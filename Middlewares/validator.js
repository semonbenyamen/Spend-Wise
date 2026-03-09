const { check, validationResult } = require('express-validator');

// شروط إضافة مصروف جديد
const expenseValidation = [
    check('title', 'Address required').not().isEmpty(),
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

module.exports = { expenseValidation };