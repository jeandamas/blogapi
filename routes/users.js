const express = require("express");

const router = express.Router();

router.get("/users", (req, res) => {
    res.send("users route");
});

module.exports = router;
