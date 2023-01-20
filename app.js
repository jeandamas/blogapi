const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const path = require("path");

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
// app.use(express.static("public"));
// app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, "public")));

// Import the routes for different endpoints
const postsRouter = require("./routes/postRoutes");
const authRouter = require("./routes/authRoutes");
const messageRouter = require("./routes/messageRoutes");
const pageRouter = require("./routes/pageRoutes");

// Use the imported routes for handling requests to the corresponding endpoints
app.use("/api/posts", postsRouter);
app.use("/api", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(pageRouter);
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
