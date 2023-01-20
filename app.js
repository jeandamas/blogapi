const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const axios = require("axios");

const instance = axios.create({
    baseURL: "http://localhost:5050/",
    timeout: 50000,
});

// SWAGGER DOCUMENTATION
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Blog API",
            description: "CRUD API for personal Website",
            version: "1.0.0",
        },
        servers: [
            { url: "https://jean-blogapi.up.railway.app/" },
            { url: "http://localhost:5050" },
        ],
    },
    // looks for configuration in specified directories
    apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

// Create an instance of an Express app
const app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");

// Set the views directory to the directory where  EJS files are located
// app.set("views", path.join(__dirname, "views"));

// Load environment variables from a .env file
require("dotenv/config");

// Set the port for the app to listen on
PORT = 5050;

// Use body-parser and cookie-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Import the routes for different endpoints
const postsRouter = require("./routes/postRoutes");
const authRouter = require("./routes/authRoutes");
const messageRouter = require("./routes/messageRoutes");

// Use the imported routes for handling requests to the corresponding endpoints
app.get("/", (req, res) => {
    res.render("index", { pageTitle: "Home" });
});
app.get("/about", (req, res) => {
    res.render("about", { pageTitle: "About" });
});

app.get("/posts/:id", async (req, res) => {
    try {
        const postId = req.params.id;
        const response = await instance.get(`/api/posts/${postId}`);
        console.log(response.data);
        if (response.data.statusCode === 200) {
            res.render("post", { pageTitle: "Blog", post: response.data.data });
        } else {
            res.redirect("/posts");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/posts");
        // res.status(500).send(error);
    }
});

app.get("/portfolio", (req, res) => {
    res.render("portfolio", { pageTitle: "Portfolio" });
});

app.get("/login", (req, res) => {
    res.render("login", { pageTitle: "Login" });
});

app.get("/register", (req, res) => {
    res.render("register", { pageTitle: "Register" });
});

app.get("/posts", async (req, res) => {
    try {
        const response = await instance.get("/api/posts");
        res.render("posts", { pageTitle: "Posts", posts: response.data });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.get("/contact", (req, res) => {
    res.render("contact", { pageTitle: "Contact" });
});

app.get("/newpost", (req, res) => {
    res.render("newpost", { pageTitle: "New Post" });
});

app.use("/api/posts", postsRouter);
app.use("/api", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// Connect to the MongoDB database
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
    console.log("connected to db");
});

// Start the server and have it listen for incoming requests on the specified port
// app.listen(process.env.PORT || PORT);
app.listen(process.env.PORT || PORT, () => {
    console.log("NODE APP STARTED");
    // swaggerDocs(app, port);
});
module.exports = app;
