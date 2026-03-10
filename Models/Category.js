const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        tyoy : mongoose.Schema.Typyes.ObjectId,
        ref: "User",
        reqired: true
    },
}, { timestamp: true });

module.exports = mongoose.model("Category", categorySchema);
