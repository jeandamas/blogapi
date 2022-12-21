const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    post: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Comment", CommentSchema);
