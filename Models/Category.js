// the purpose  of this Category is to allow the user to create categorize expenses 

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        reqired: true
    },
}, { timestamp: true });

module.exports = mongoose.model("Category", categorySchema);
