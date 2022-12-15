const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
require("dotenv/config");
PORT = 5050;
app.use(bodyParser.json());

// import routes
const postsRoute = require("./routes/posts");
const usersRoute = require("./routes/users");
const contactRouter = require("./routes/contact");
// use imported routes Routes
app.use("/api/posts", postsRoute);
app.use("/api/users", usersRoute);
app.use("/api/contact", contactRouter);

// connect to the database
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
    console.log("connected to db");
});

// connect app to the server port
app.listen(PORT);
