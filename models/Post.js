const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter post title"],
    },
    imageURL: {
        type: String,
        required: [true, "Please enter post image URL"],
    },
    content: {
        type: String,
        required: [true, "Please enter post content"],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    likes: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
    ],
    comments: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, required: true },
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            name: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
});

// SWAGGER

/**
 * @swagger
 *  components:
 *      chemas:
 *          Post:
 *              type:object
 *              required:
 *                  - title
 *                  - content
 *              properties:
 *                  id:
 *                      type:string
 *                      description: The auto generated id
 *                  title:
 *                      type:string
 *                      description: The post title
 *                  content:
 *                      type:string
 *                      description: Content of the post
 *                  example:
 *                       id:eyJhbGciOiJIUzI1NiIsInR
 *                       title: How to upload image to secure AWS S3
 *                       content: Lorem lorem lorem. Lorem lorem lorem. Lorem lorem lorem.
 **/

// METHOD TO LIKE/UNLINE POST
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
// METHOD TO COMMENT ON POST

PostSchema.methods.addComment = function (userId, content) {
    // Generate a new ObjectId for the comment
    const commentId = new mongoose.Types.ObjectId();

    // Create a new comment object
    const comment = {
        _id: commentId,
        user: userId,
        content: content,
    };

    // Add the comment to the comments array
    this.comments.push(comment);

    // Save the changes to the database
    return this.save();
};

module.exports = mongoose.model("Posts", PostSchema);
