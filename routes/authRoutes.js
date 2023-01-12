const express = require("express");
const router = express.Router();
const authConstroller = require("../controllers/authController");
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
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto generated user ID
 *           example: 63be8ed5bf27543b1e12c0e4
 *         name:
 *           type: string
 *           description: The name of the user
 *           example: Jean Damascene
 *         email:
 *           type: string
 *           description: The user email
 *           example: contact@gmail.com
 *         password:
 *           type: string
 *           description: The user password
 *           example: 2b$10TDsG
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Managing Users
 */

/**
 * @swagger
 * paths:
 *   /api/signup:
 *     post:
 *       tags: [Users]
 *       summary: Sign up a new user
 *       description: Create a new user account
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the user
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email address of the user.
 *                 password:
 *                   type: string
 *                   description: The password of the user.
 *               required:
 *                 - name
 *                 - email
 *                 - password
 *       responses:
 *         201:
 *           description: Successfully created a new user
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         400:
 *           description: Invalid request body. Missing required fields or invalid data provided.
 *         409:
 *           description: Conflict. Email already exists.
 *         500:
 *           description: Server error
 *         default:
 *           description: Unexpected error
 *
 *   /api/login:
 *     post:
 *       tags: [Users]
 *       summary: Login user
 *       description: Logs a user in by verifying their credentials and returning a token.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email address of the user.
 *                 password:
 *                   type: string
 *                   description: The password of the user.
 *               required:
 *                 - email
 *                 - password
 *       responses:
 *         200:
 *           description: Successfully logged in
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                     description: A JSON Web Token that can be used to authenticate future requests.
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *                     description: The user object.
 *         400:
 *           description: Invalid request. Missing required fields or invalid data provided.
 *         401:
 *           description: Unauthorized. Missing or invalid JWT provided.
 *         500:
 *           description: Server error.
 *         default:
 *           description: Unexpected error
 */

router
    .get("/signup", authConstroller.signup_get)
    .post("/signup", authConstroller.signup_post)
    // .get("/login", authConstroller.login_get)
    .post("/login", authConstroller.login_post)
    .get("/user", authConstroller.user_get)
    .get("/logout", authConstroller.logout_get)
    .get("/users", requireAdminAuth, authConstroller.get_all_users);

module.exports = router;
