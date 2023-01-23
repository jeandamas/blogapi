const { Router } = require("express");
const express = require("express");
const { route } = require("./postRoutes");
const router = express.Router();
const API_URL = "localhost:5000";
const session = require("express-session");
const flash = require("connect-flash");
const { requireAdminAuth } = require("../middleware/authMiddleware");
const axios = require("axios");
// const BASE_URL = "http://localhost:5050/";
const BASE_URL = "https://jean-blogapi-front.up.railway.app/";
const instance = axios.create({
    baseURL: BASE_URL,
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
            console.log(postId);
            const response = await instance.post(`/api/posts/${postId}/like`);
            console.log(response.data);
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
        res.render("register", { pageTitle: "Register", errors: "" });
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
    })
    .get("/messages", requireAdminAuth, async (req, res) => {
        // const token = req.headers.authorization;
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).send("Unauthorized");
        }
        // console.log(token);
        // Proceed with token validation or invalidation
        try {
            const messagesPromise = instance.get("/api/messages", {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });

            const messages = await messagesPromise;
            // console.log(messages.data);
            res.render("admin_messages", {
                pageTitle: "Messages",
                messages: messages.data,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    })

    .get("/users", requireAdminAuth, async (req, res) => {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).send("Unauthorized");
        }

        try {
            const usersPromise = instance.get("/api/users", {
                headers: {
                    Authorization: token,
                },
            });

            const users = await usersPromise;
            res.render("admin_users", {
                pageTitle: "Users",
                users: users.data,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    })
    .get("/admin_posts", requireAdminAuth, async (req, res) => {
        // const token = req.headers.authorization;
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).send("Unauthorized");
        }
        // console.log(token);
        // Proceed with token validation or invalidation
        try {
            const postsPromise = instance.get("/api/posts", {
                headers: {
                    Authorization: token,
                },
            });

            const [posts] = await Promise.all([postsPromise]);
            // console.log(messages.data);
            res.render("admin_posts", {
                pageTitle: "Admin Posts",
                posts: posts.data,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    })

    .get("/admin", requireAdminAuth, async (req, res) => {
        // const token = req.headers.authorization;
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).send("Unauthorized");
        }
        // console.log(token);
        // Proceed with token validation or invalidation
        try {
            const messagesPromise = instance.get("/api/messages", {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            const postsPromise = instance.get("/api/posts", {
                headers: {
                    Authorization: token,
                },
            });
            const usersPromise = instance.get("/api/users", {
                headers: {
                    Authorization: token,
                },
            });

            const [messages, posts, users] = await Promise.all([
                messagesPromise,
                postsPromise,
                usersPromise,
            ]);
            // console.log(messages.data);
            res.render("admin", {
                pageTitle: "Admin",
                messages: messages.data,
                posts: posts.data,
                users: users.data,
            });
        } catch (error) {
            res.status(401).redirect("/login");
            // console.log(error);
            // res.status(500).send(error);
        }
    });

module.exports = router;
