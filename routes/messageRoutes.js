const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { requireAdminAuth } = require("../middleware/authMiddleware");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     JWT:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - message
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the message sender
 *           example: Jean Damascene
 *         email:
 *           type: string
 *           description: The email of the message sender
 *           example: contact@jean.rw
 *         message:
 *           type: string
 *           description: The message from the sender
 *           example: Hello I would like to see more cloud computing content
 */

/**
 * @swagger
 * tags:
 *   name: Contact messages
 *   description: API interaction with Contact us messages
 */

/**
 * @swagger
 * paths:
 *   /api/messages:
 *     get:
 *       summary: ADMIN Retrieves a list of all contact messages
 *       tags: [Contact messages]
 *       security:
 *         - JWT: []
 *       description: Returns a list of all messages.
 *       responses:
 *         200:
 *           description: Successful operation
 *         400:
 *           description: Invalid request. Missing required fields or invalid data provided.
 *         401:
 *           description: Unauthorized. Missing or invalid JWT provided.
 *         500:
 *           description: Internal Server Error.
 *         default:
 *           description: Unexpected error.
 *     post:
 *       summary: Add new message
 *       tags: [Contact messages]
 *       description: Creates a new message
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the sender.
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email of the sender
 *                 message:
 *                   type: string
 *                   description: The message content.
 *               required:
 *                 - name
 *                 - email
 *                 - message
 *       responses:
 *         201:
 *           description: Message created successfully.
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
 *
 *   /api/messages/{id}:
 *     get:
 *       summary: ADMIN Get the message by ID
 *       tags: [Contact messages]
 *       security:
 *         - JWT: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The Message id
 *       description: Returns a list of all messages, ONLY ADMIN CAN PERFORM THIS ACTION.
 *       responses:
 *         200:
 *           description: Successful operation
 *         400:
 *           description: Invalid request. Missing required fields or invalid data provided.
 *         401:
 *           description: Unauthorized. Missing or invalid JWT provided.
 *         500:
 *           description: Internal Server Error.
 *         default:
 *           description: Unexpected error.
 */

router
    .post("/", messageController.add_new_message)
    .get("/", requireAdminAuth, messageController.get_all_messages)
    .get("/:messageID", messageController.get_one_message);

module.exports = router;
