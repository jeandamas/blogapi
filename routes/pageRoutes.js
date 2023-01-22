const { Router } = require("express");
const express = require("express");
const { route } = require("./postRoutes");
const router = express.Router();
const axios = require("axios");
const API_URL = "localhost:5000";
const session = require("express-session");
const flash = require("connect-flash");
const instance = axios.create({
    baseURL: "http://localhost:5050/",
    timeout: 50000,
});
router
    .get("/", (req, res) => {
        res.render("index", { pageTitle: "Home" });
    })
    .get("/about", (req, res) => {
        res.render("about", { pageTitle: "About" });
    })
    .get("/posts/:id", async (req, res) => {
        try {
            const postId = req.params.id;
            const response = await instance.get(`/api/posts/${postId}`);
            console.log(response.data);
            if (response.data.statusCode === 200) {
                res.render("post", {
                    pageTitle: "Blog",
                    post: response.data.data,
                });
            } else {
                res.redirect("/posts");
            }
        } catch (error) {
            console.log(error);
            res.redirect("/posts");
            // res.status(500).send(error);
        }
    })
    .get("/like/:id", async (req, res) => {
        try {
            const postId = req.params.id;
            const response = await instance.get(`/api/posts/${postId}/like`);
            console.log(response.data);
            if (response.data.statusCode === 200) {
                res.redirect("/posts/" + postId);
            } else {
                res.redirect("/posts/");
            }
        } catch (error) {
            console.log(error);
            res.redirect("/posts");
            // res.status(500).send(error);
        }
    })
    .get("/portfolio", (req, res) => {
        res.render("portfolio", { pageTitle: "Portfolio" });
    })
    .get("/login", (req, res) => {
        let message = req.flash("Add your credentials");
        res.render("login", { pageTitle: "Login", message });
    })
    .get("/register", (req, res) => {
        res.render("register", { pageTitle: "Register" });
    })
    .get("/posts", async (req, res) => {
        try {
            const response = await instance.get("/api/posts");
            res.render("posts", { pageTitle: "Posts", posts: response.data });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    })
    .get("/newpost", (req, res) => {
        res.render("newpost", { pageTitle: "New Post" });
    })
    .get("/notifications", (req, res) => {
        res.render("notifications", { pageTitle: "Notification" });
    })
    .get("/contact", (req, res) => {
        res.render("contact", { pageTitle: "Contact" });
    })
    .get("/logout", async (req, res) => {
        res.redirect("/api/logout");
    });

module.exports = router;
