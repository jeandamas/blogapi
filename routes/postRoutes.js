const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { requireAdminAuth } = require("../middleware/authMiddleware");
const postController = require("../controllers/postController");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     JWT:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - imageURL
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated post ID
 *           example: 63a38909ffe897795c793a18
 *         title:
 *           type: string
 *           description: The title of the blog post
 *           example: How to host a static site on AWS s3
 *         imageURL:
 *           type: string
 *           description: The image link for the blog post
 *           example: https://jeanbucket001.s3.us-west-2.amazonaws.com/profile+image.jpeg
 *         content:
 *           type: string
 *           description: The blog post content
 *           example: Amazon S3 (Simple Storage Service) is a highly scalable, object storage service offered by Amazon Web Services (AWS) that can be used to host a static website.
 *         date:
 *           type: string
 *           description: The auto generated time blog post is saved
 *           example: 2022-12-21T22:30:33.644Z
 *         likes:
 *           type: array
 *           description: The array of users who liked the blog post
 *           example: [63a38909ffe897795c793a18,63be8ed5bf27543b1e12c0e4]
 *         comments:
 *           type: array
 *           description: The array of comments from users on the blog post
 *           example: [{_id: 63be8f2e1222e16b322fb214, user: 63be8ed5bf27543b1e12c0e4, content: the comment from the admin, createdAt: 2023-01-11T10:27:58.232Z}]
 */

/**
 * @swagger
 * tags:
 *   name: Blog posts
 *   description: Managing blog posts
 */

/**
 * @swagger
 * paths:
 *   /api/posts:
 *     get:
 *       summary: Retrieves a list of all blog posts
 *       tags: [Blog posts]
 *       description: Returns a list of all blog posts.
 *       responses:
 *         200:
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   data:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Post'
 *         400:
 *           description: Invalid request. Missing required fields or invalid data provided.
 *         401:
 *           description: Unauthorized. Missing or invalid JWT provided.
 *         500:
 *           description: Internal Server Error.
 *         default:
 *           description: Unexpected error.
 *     post:
 *       summary: Add new Blog post
 *       tags: [Blog posts]
 *       security:
 *         - JWT: []
 *       description: Creates a new Blog post
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The title of the blog post.
 *                 imageURL:
 *                   type: string
 *                   description: The image url of the post
 *                 content:
 *                   type: string
 *                   description: The content body of the blog post.
 *               required:
 *                 - title
 *                 - content
 *                 - imageURL
 *       responses:
 *         201:
 *           description: Blog post created successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Post'
 *         400:
 *           description: Invalid request. Missing required fields or invalid data provided.
 *         401:
 *           description: Unauthorized. Missing or invalid JWT provided.
 *         403:
 *           description: Forbidden. User does not have permission to create a blog post.
 *         500:
 *           description: Internal Server Error.
 *         default:
 *           description: Unexpected error.
 *   /api/posts/{id}:
 *     get:
 *       summary: Get the blog post by ID
 *       tags: [Blog posts]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The Blog post id
 *       responses:
 *         200:
 *           description: The blog post
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#components/schemas/Post'
 *         404:
 *           description: The Blog post was not found
 *   /api/posts/{id}/like:
 *     post:
 *       summary: Like the blog post by ID
 *       security:
 *         - JWT: []
 *       tags: [Blog posts]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The Blog post id
 *       responses:
 *         200:
 *           description: The blog post
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#components/schemas/Post'
 *         404:
 *           description: The Blog post was not found
 */

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
