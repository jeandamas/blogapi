const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv/config");

// HANDLE ERRORS
const handleErrors = (err) => {
    let errors = { name: "", email: "", password: "" };

    // duplicate user validation
    if (err.code === 11000) {
        errors.email = "Email already registered";
        return errors;
    }

    // incorect credentials
    if (err.message === "Wrong Email or Password") {
        errors = "Wrong email or password";
    }

    // user registration validation errors
    if (err.message.includes("User validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};

// FUNCTION TO CREATE A TOKEN
const MAXAGE = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: MAXAGE });
};

module.exports.signup_get = (req, res) => {
    res.json({ page: "signup get page under construction" });
};

// CURRENT USER
module.exports.user_get = (req, res) => {
    const token = req.cookies.jwt;
    // check it jwt exists and verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.json({ status: 400, message: "an error occured", err });
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.status(200).json({
                    status: 200,
                    message: "Current user",
                    // data: [{ name: user.name, email: user.email }],
                    data: user,
                });
            }
        });
    } else {
        res.status(404).json({
            statusCode: 404,
            message: "Logged In User Not Found",
        });
    }
};

// LOGOUT USER
module.exports.logout_get = (req, res) => {
    res.cookie("jwt", "", { httpOnly: true, maxAge: 1000 });
    // res.status(200).json({ status: 200, message: "Logged out" });
    res.status(200).render("notifications", {
        pageTitle: "Logout",
        message: "Logged out",
    });
};

module.exports.login_get = (req, res) => {
    res.json({ page: "login get page under construction" });
};

// CREATE NEW USER [SIGN UP -> POST]
module.exports.signup_post = async (req, res) => {
    // Get email, password, and date from request body
    const { name, email, password, date } = req.body;

    try {
        // Create new user
        const user = await User.create({ name, email, password, date });
        // generate a token for user created
        const token = createToken(user._id);
        // store token as a cookie
        res.cookie("jwt", token, { httpOnly: true, maxAge: MAXAGE * 1000 });
        // Send response with created user and status code 201
        // res.status(201).render("notifications", {
        //     pageTitle: "Created Account",
        //     message: "Welcome  account created",
        // });
        res.status(201).json({
            status: 201,
            message: "Registered user created and user token created",
            data: [
                {
                    jwt: token,
                    "New User Name": user.name,
                    "New User Email": user.email,
                },
            ],
        });
    } catch (err) {
        // If user creation fails return this json
        // res.json({ message: err.message });
        const errors = handleErrors(err);
        res.status(400).json({ status: 400, errors });
    }
};

module.exports.login_post = async (req, res) => {
    // res.json({ page: "user login post page" });
    const { email, password } = req.body;
    try {
        // retrieve user from the database
        const user = await User.login(email, password);
        // create token for the user
        const token = createToken(user._id);
        // store the token as a cookie
        res.cookie("jwt", token, { httpOnly: true, maxAge: MAXAGE * 1000 });
        // Send response with created user and status code 201
        res.status(201).json({
            statusCode: 201,
            message: "user logged in and token created",
            data: { Name: user.name, Email: user.email, jwt: token },
        });

        // res.status(200).json({
        //     "Logged Successfuly with userEmail": user.email,
        // });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({
            status: 400,
            message: errors,
        });
    }
};

module.exports.get_all_users = async (req, res) => {
    try {
        // query the database for all users
        const users = await User.find();

        // return users as a JSON object
        res.status(200).json({
            statusCode: 200,
            message: "success",
            data: users,
        });
    } catch (err) {
        // return an error message if the users cannot be retrieved
        res.status(400).json({
            statusCode: 400,
            message: "Failed",
            data: [err],
        });
    }
};
