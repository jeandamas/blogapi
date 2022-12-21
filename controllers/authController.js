const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv/config");

// HANDLE ERRORS
const handleErrors = (err) => {
    let errors = { email: "", password: "" };

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

module.exports.login_get = (req, res) => {
    res.json({ page: "login get page under construction" });
};

// CREATE NEW USER [SIGN UP POST]
module.exports.signup_post = async (req, res) => {
    // Get email, password, and date from request body
    const { email, password, date } = req.body;

    try {
        // Create new user
        const user = await User.create({ email, password, date });
        // generate a token for user created
        const token = createToken(user._id);
        // store token as a cookie
        res.cookie("jwt", token, { httpOnly: true, maxAge: MAXAGE * 1000 });
        // Send response with created user and status code 201
        res.status(201).json({
            status: 201,
            message: "Registered user created and user token created",
            jwt: token,
            "New User Email": user.email,
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
            Status: 201,
            message: "user logged in and token created",
            jwt: token,
            "Logged in User Email": user.email,
        });

        // res.status(200).json({
        //     "Logged Successfuly with userEmail": user.email,
        // });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ status: 400, errors });
    }
};
