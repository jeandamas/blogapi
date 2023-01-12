const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please enter your name"],
        minlength: [1, "Name should not be empty"],
    },
    email: {
        type: String,
        require: [true, "Please enter your email"],
        minlength: [1, "Email should not be empty"],
    },
    message: {
        type: String,
        require: [true, "Please enter your message"],
        minlength: [1, "Message should not be empty"],
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Message", MessageSchema);
