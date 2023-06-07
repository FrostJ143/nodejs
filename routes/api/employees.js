const express = require("express");
const router = express.Router();
const path = require("path");
const data = {}

data.employees = require("../../data/data.json");

router.route("/")
    .get((req, res) => {
        res.json(data);
    })

module.exports = router;