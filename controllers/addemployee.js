var express = require("express");
var router = express.Router();
module.exports = router;

router.get("/add", function (req, res) {
    res.render("addemployee", { title: "Add employee" });
});

