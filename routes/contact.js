const express = require("express");

const router = express.Router();

router
    .get("/contact", (req, res) => {
        res.send("contact route");
    })
    .get("/contact/sample", (req, res) => {
        res.send("contact route sample");
    });

module.exports = router;
