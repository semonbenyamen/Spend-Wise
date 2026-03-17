const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    //Link between budget and user
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    //Budget value
    amount: {
        type : Number,
        required: true,
    },
    month: {
        type : Number,
        required : true,
    },
    year: {
        type : Number,
        required : true,
    },
    //
    alertSent: {
        type: String,
        default: "none",
    }

}, { timestamps : true});

module.exports = mongoose.model("Budget", budgetSchema);