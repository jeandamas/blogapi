const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { requireAdminAuth } = require("../middleware/authMiddleware");
const postController = require("../controllers/postController");

router
    .get("/", postController.get_all_posts)
    .get("/:postID", postController.get_one_post)
    .post("/", requireAdminAuth, postController.add_new_post)
    .delete("/:postID", requireAdminAuth, postController.delete_one_post)
    .patch("/:postID", requireAdminAuth, postController.update_one_post)
    .post("/:id/like", requireAuth, postController.like_one_post)
    .get("/:postId/comments", postController.get_one_post_commments)
    .post("/:postId/comments", requireAuth, postController.comment_to_a_post)
    .put(
        "/:postId/comments/:commentId",
        requireAuth,
        postController.update_comment
    )
    .delete(
        "/:postId/comments/:commentId",
        requireAuth,
        postController.delete_comment
    );

module.exports = router;
