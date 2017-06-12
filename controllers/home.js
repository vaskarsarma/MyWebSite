var express = require("express");
var router = express.Router();

//Get Home Page
router.get('/', function (req, res) {
    res.render('home', { title: 'Home Page' });
});

router.get('/home', function (req, res) {
    res.render('home', { title: 'Home Page' });
});

module.exports = router;