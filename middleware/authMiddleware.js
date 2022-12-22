const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv/config");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    // check it jwt exists and verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.json({
                    status: 400,
                    message: "Not authorized to perform this action",
                    err,
                });
                console.log(decodedToken);
            } else {
                next();
            }
        });
    } else {
        res.status(401).json({
            Status: 401,
            message: "Not authorized to perform this action",
        });
    }
};

// require admin auth
const requireAdminAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    // check it jwt exists and verified

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.json({
                    status: 400,
                    message: "Not authorized to perform this action",
                    err,
                });
            } else {
                let user = await User.findById(decodedToken.id);
                if (isAdmin(user.id)) {
                    next();
                } else {
                    res.status(401).json({
                        status: 401,
                        message: "Not authorized to perform this action",
                    });
                }
            }
        });
    } else {
        res.status(401).json({
            Status: 401,
            message: "Not authorized to perform this action",
        });
    }
};

// Is Admin Function
function isAdmin(userID) {
    if (userID === process.env.ADMIN_USER_ID) {
        return true;
    } else {
        return false;
    }
}

// Check logged in user
const checkUser = (req, res, next) => {
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
        res.json({ message: "No user logged in" });
    }
};

// RETURN CURRENT USER
const currentUser = () => {
    const token = req.cookies.jwt;
    // check it jwt exists and verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                return "";
            } else {
                let user = await User.findById(decodedToken.id);
                res.json(user);
                // return user;
            }
        });
    } else {
        return "";
    }
};

module.exports = { requireAuth, checkUser, requireAdminAuth, currentUser };
