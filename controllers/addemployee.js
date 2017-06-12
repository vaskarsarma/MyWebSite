var express = require("express");
var router = express.Router();

router.get("/add", function (req, res) {
    res.render("addemployee", { title: "Add employee" });
});

module.exports = router;