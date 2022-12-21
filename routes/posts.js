const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { requireAuth } = require("../middleware/authMiddleware");

router
    // GET ALL POSTS
    .get("/", async (req, res) => {
        try {
            // query the database for all posts
            const posts = await Post.find();

            // return the posts as a JSON object
            res.status(200).json(posts);
        } catch (err) {
            // return an error message if the posts cannot be retrieved
            res.json({ message: err });
        }
    })

    // CREATE A NEW POST
    .post("/", requireAuth, async (req, res) => {
        // create a new post object
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
        });
        try {
            // save the post to the database
            const savedPost = await post.save();
            // return the saved post as a JSON object
            res.status(201).json(savedPost);
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
            res.status(200).json(post);
        } catch (err) {
            // return an error message if the post is not found
            res.json({ message: err });
        }
    })

    // DELETE A SPECIFIC POST
    .delete("/:postID", requireAuth, async (req, res) => {
        try {
            // delete the post from the database
            const deletedPost = await Post.remove({ _id: req.params.postID });
            // return the deleted post as a JSON object
            res.json(deletedPost);
        } catch (err) {
            // return an error message if the post cannot be deleted
            res.json({ message: err });
        }
    })

    // UPDATE A SPECIFIC POST
    .patch("/:postID", requireAuth, async (req, res) => {
        try {
            // update the post in the database
            const updatedPost = await Post.updateOne(
                { _id: req.params.postID },
                { $set: { title: req.body.title, content: req.body.content } }
            );
            res.json(updatedPost);
        } catch (err) {
            res.json({ message: err });
        }
    });

module.exports = router;
