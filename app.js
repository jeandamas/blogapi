const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// Require the auth middleware
const { requireAuth } = require("./middleware/authMiddleware");

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
const postsRoute = require("./routes/posts");
const usersRoute = require("./routes/users");
const contactRouter = require("./routes/contact");
const authRouter = require("./routes/authRoutes");

// Use the imported routes for handling requests to the corresponding endpoints
app.use("/api/posts", postsRoute);
app.use("/api/users", usersRoute);
app.use("/api/contact", contactRouter);
app.use("/api", authRouter);

// Connect to the MongoDB database
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
    console.log("connected to db");
});

// Start the server and have it listen for incoming requests on the specified port
app.listen(PORT);
