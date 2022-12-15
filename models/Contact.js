const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        require: true,
    },
    message_date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Contact", ContactSchema);
