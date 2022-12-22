const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter post title"],
    },
    content: {
        type: String,
        required: [true, "Please enter post content"],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
});

PostSchema.methods.toggleLike = function (userId) {
    // Check if the user has already liked the post
    const liked = this.likes.includes(userId);

    // If the user has already liked the post, remove their like
    if (liked) {
        this.likes = this.likes.filter(
            (like) => like.toString() !== userId.toString()
        );
    } else {
        // Otherwise, add their like
        this.likes.push(userId);
    }

    // Save the changes to the database
    return this.save();
};

module.exports = mongoose.model("Posts", PostSchema);
