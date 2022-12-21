const jwt = require("jsonwebtoken");
require("dotenv/config");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check it jwt exists and verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.json({ status: 400, message: "not authorized", err });
            } else {
                next();
            }
        });
    } else {
        res.status(401).json({
            Status: 401,
            message: "not authenticated to access this resource",
        });
    }
};

module.exports = { requireAuth };
