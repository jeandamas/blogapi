const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    registration_date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("User", UserSchema);
