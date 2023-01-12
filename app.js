const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

// SWAGGER DOCUMENTATION
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Blog API",
            description: "CRUD API for personal Website",
            version: "1.0.0",
        },
        servers: [{ url: "http://localhost:5050" }],
    },
    // looks for configuration in specified directories
    apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

// Create an instance of an Express app
const app = express();

// Load environment variables from a .env file
require("dotenv/config");

// Set the port for the app to listen on
PORT = 5050;

// Use body-parser and cookie-parser middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Import the routes for different endpoints
const postsRouter = require("./routes/postRoutes");
const authRouter = require("./routes/authRoutes");
const messageRouter = require("./routes/messageRoutes");

// Use the imported routes for handling requests to the corresponding endpoints
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
