const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireAdminAuth } = require("../middleware/authMiddleware");
const postController = require("../controllers/postController");

// OLD =======================
router
    // GET ALL POSTS
    .get("/", async (req, res) => {
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
                status: 400,
                message: "Failed",
                data: [err],
            });
        }
    })

    // CREATE A NEW POST
    .post("/", requireAdminAuth, async (req, res) => {
        // create a new post object
        const { title, content, date } = req.body;

        try {
            // save the post to the database
            const savedPost = await Post.create({ title, content, date });
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
    })

    // READ A SPECIFIC POST
    .get("/:postID", async (req, res) => {
        try {
            // get the post ID from the request
            const id = req.params.postID;

            // query the database for the post with the specified ID
            const post = await Post.findById(id);

            // return the post as a JSON object
            res.status(200).json({ message: "Requested Post", data: [post] });
        } catch (err) {
            // return an error message if the post is not found
            res.status(401).json({
                status: 401,
                message: "post does not exist",
                data: [err],
            });
        }
    })

    // DELETE A SPECIFIC POST
    .delete("/:postID", requireAdminAuth, async (req, res) => {
        try {
            // delete the post from the database
            const deletedPost = await Post.deleteone({
                _id: req.params.postID,
            });
            // return the deleted post as a JSON object
            res.status(200).json({
                status: 200,
                message: "success",
                data: [deletedPost],
            });
        } catch (err) {
            // return an error message if the post cannot be deleted
            res.json({ message: err });
        }
    })

    // UPDATE A SPECIFIC POST
    .patch("/:postID", requireAdminAuth, async (req, res) => {
        try {
            // update the post in the database
            const updatedPost = await Post.updateOne(
                { _id: req.params.postID },
                { $set: { title: req.body.title, content: req.body.content } }
            );
            res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: [updatedPost],
            });
        } catch (err) {
            res.status(400).json({ message: "Failed", data: [err] });
        }
    })
    .put("/:id/like", async (req, res) => {
        res.json({ message: "success", "liked article": req.params.id });
    });

module.exports = router;
