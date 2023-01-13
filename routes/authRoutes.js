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
 *           example: b22c463bf63bfb8b8b22c4
 *         name:
 *           type: string
 *           description: The name of the user
 *           example: user name
 *         email:
 *           type: string
 *           description: The user email
 *           example: user@example.com
 *         password:
 *           type: string
 *           description: The hashed user password
 *           example: 0$FSoqIA$10$F./nKxadedZIMKIxdYJa./$2b$1SoqIAMKIxdYJanKxadedZI$2b
 *         registration_date:
 *           type: string
 *           description: The auto generated user registration date
 *           example: 2023-01-12T07:37:22.057Z
 *     newUser:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The new user full name
 *           example: user name
 *         email:
 *           type: string
 *           description: The new user email
 *           example: user@example.com
 *         password:
 *           type: string
 *           description: The new user password
 *           example: userpass
 *     loginUser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *           example: user@example.com
 *         password:
 *           type: string
 *           description: The user password
 *           example: userpass
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API interaction with users
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
 *               "$ref": "#/components/schemas/newUser"
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
 *               $ref: '#/components/schemas/loginUser'
 *       responses:
 *         200:
 *           description: Successfully logged in
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/loginUser'
 *         400:
 *           description: Invalid request. Missing required fields or invalid data provided.
 *         401:
 *           description: Unauthorized. Missing or invalid JWT provided.
 *         500:
 *           description: Server error.
 *         default:
 *           description: Unexpected error
 *   /api/users:
 *     get:
 *       tags: [Users]
 *       summary: ADMIN Retrieves a list of all registered users.
 *       security:
 *         - JWT: []
 *       description: Returns a list of all registered users ONLY ADMIN can perform this action"
 *       responses:
 *         200:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         400:
 *           description: Invalid request. Missing required fields or invalid data provided.
 *         401:
 *           description: Unauthorized. Missing or invalid JWT provided.
 *         500:
 *           description: Server error.
 *         default:
 *           description: Unexpected error
 *   /api/logout:
 *     get:
 *       tags: [Users]
 *       summary: Logout user
 *       security:
 *         -  JWT: []
 *       description: Logs out current logged in user session
 *       responses:
 *         200:
 *           description: Successfully logged out
 *         500:
 *           description: Internal Server Error - An error occurred while processing the request.
 *   /api/user:
 *     get:
 *       tags: [Users]
 *       summary: USER gets current user details
 *       security:
 *         -  JWT: []
 *       description: Details of the current user
 *       responses:
 *         200:
 *           description: Successfully retriever user information
 *         404:
 *           description: No logged in user.
 *         401:
 *           description: Unauthorized. Missing or invalid JWT provided.
 *         500:
 *           description: Server error.
 *         default:
 *           description: Unexpected error
 *
 *
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
