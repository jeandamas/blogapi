const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv/config");
const Post = require("../models/Post");

module.exports.get_all_posts = async (req, res) => {
    try {
        // query the database for all posts
        const posts = await Post.find();

        // return the posts as a JSON object
        res.status(200).json({
            statusCode: 200,
            message: "success",
            data: posts,
        });
    } catch (err) {
        // return an error message if the posts cannot be retrieved
        res.status(400).json({
            statusCode: 400,
            message: "Failed",
            data: [err],
        });
    }
};

module.exports.get_one_post = async (req, res) => {
    try {
        // get the post ID from the request
        const id = req.params.postID;

        // query the database for the post with the specified ID
        const post = await Post.findById(id);

        // return the post as a JSON object
        res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: post,
        });
    } catch (err) {
        // return an error message if the post is not found
        res.status(404).json({
            statusCode: 404,
            message: "post does not exist",
            data: err,
        });
    }
};

module.exports.add_new_post = async (req, res) => {
    // create a new post object
    const { title, imageURL, content, date } = req.body;

    try {
        // save the post to the database
        const savedPost = await Post.create({ title, imageURL, content, date });
        // return the saved post as a JSON object
        res.status(201).json({
            statusCode: 200,
            message: "new post created successfuly",
            data: savedPost,
        });
    } catch (err) {
        // return an error message if the post cannot be saved
        res.json({ message: err });
    }
};
module.exports.update_one_post = async (req, res) => {
    try {
        // update the post in the database
        const updatedPost = await Post.updateOne(
            { _id: req.params.postID },
            {
                $set: {
                    title: req.body.title,
                    imageURL: req.body.imageURL,
                    content: req.body.content,
                },
            }
        );
        res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: [updatedPost],
        });
    } catch (err) {
        res.status(400).json({ message: "Failed", data: [err] });
    }
};
module.exports.delete_one_post = async (req, res) => {
    try {
        // delete the post from the database
        const deletedPost = await Post.deleteOne({
            _id: req.params.postID,
        });
        // return the deleted post as a JSON object
        res.status(200).json({
            statusCode: 200,
            message: "success",
            data: [deletedPost],
        });
    } catch (err) {
        // return an error message if the post cannot be deleted
        res.json({ message: err });
    }
};

// LIKE OR UNLIKE A POST
module.exports.like_one_post = async (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findById(decodedToken.id);
        try {
            // Find the post by its ID
            const post = await Post.findById(req.params.id);

            // Toggle the like for the current user
            await post.toggleLike(user.id);

            res.json(post);
        } catch (error) {
            res.status(400).send(error);
        }
    } else {
        res.status(400).json({ statusCode: 400, message: "failed" });
    }
};

// GET ALL POST COMMENTS
module.exports.get_one_post_commments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            res.status(404).json({
                status: 404,
                message: "Post not found",
            });
        } else {
            res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: post.comments,
            });
        }
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "failed",
            data: error,
        });
    }
};

// COMMENT ON A POST - ROUTE: /posts/:postId/comments to add a comment to a post
module.exports.comment_to_a_post = async (req, res) => {
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(decodedToken.id);
    try {
        // Find the post by its ID
        const post = await Post.findById(req.params.postId);

        // Add a comment to the post - function is defined in the Post schema
        await post.addComment(user.id, req.body.content, user.name);

        res.status(201).json({
            statusCode: 201,
            message: "success",
            data: post,
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

// UPDATE COMMENT ON POST - ROUTE: /posts/:postId/comments/:commentId
module.exports.update_comment = async (req, res) => {
    try {
        // Verify the JWT token and retrieve User from database
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findById(decodedToken.id);

        // Find the post by its ID
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res
                .status(404)
                .json({ statusCode: 404, message: "Post not found" });
        }

        // Find the comment by its ID
        const comment = post.comments.id(req.params.commentId);
        if (!comment) {
            return res
                .status(404)
                .json({ statusCode: 404, message: "Comment not found" });
        }

        // If user owns the comment, update the comment with the new content
        if (user._id.toString() === comment.user.toString()) {
            comment.content = req.body.content;
        } else {
            return res
                .status(403)
                .json({ statusCode: 403, message: "Not authorized" });
        }

        // Save the changes to the database
        await post.save();

        res.send(post);
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res
                .status(401)
                .json({ statusCode: 401, message: "Unauthorized" });
        }
        res.status(500).send(error);
    }
};

// DELETE COMMENT FROM A POST
module.exports.delete_comment = async (req, res) => {
    try {
        // Verify the JWT token and retrieve User from database
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findById(decodedToken.id);

        // Find the post by its ID
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res
                .status(404)
                .json({ statusCode: 404, message: "Post not found" });
        }

        // Find the comment by its ID
        const comment = post.comments.id(req.params.commentId);
        if (!comment) {
            return res
                .status(404)
                .json({ statusCode: 404, message: "Comment not found" });
        }

        // If user owns the comment, update the comment with the new content
        if (user._id.toString() === comment.user.toString()) {
            // Remove the comment from the comments array
            post.comments.id(req.params.commentId).remove();
        } else {
            return res
                .status(403)
                .json({ statusCode: 403, message: "Not authorized" });
        }

        // Save the changes to the database
        await post.save();

        res.send(post);
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: " server error",
            data: [error],
        });
    }
};
