const express = require("express");
const router = express.Router();
const authConstroller = require("../controllers/authController");
router
    .get("/signup", authConstroller.signup_get)
    .post("/signup", authConstroller.signup_post)
    .get("/login", authConstroller.login_get)
    .post("/login", authConstroller.login_post);

module.exports = router;
