const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireAdminAuth } = require("../middleware/authMiddleware");
const postController = require("../controllers/postController");

router
    .get("/", postController.get_all_posts)
    .get("/:postID", postController.get_one_post)
    .post("/", requireAdminAuth, postController.add_new_post)
    .delete("/:postID", requireAdminAuth, postController.delete_one_post)
    .patch("/:postID", requireAdminAuth, postController.update_one_post)
    .put("/:id/like", postController.like_one_post);

module.exports = router;
