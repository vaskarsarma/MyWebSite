var express = require("express");
var app = express();
var path = require("path");
var hbs = require("express-handlebars");
var bodyparser = require("body-parser");
var home = require('./controllers/home');
var emplist = require('./controllers/employees');
var empreg = require('./controllers/addemployee');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs({
    defaultLayout: 'layout' 
    // Example to use custom helper function for HandleBar
    // , helpers: {
    //      test: require("./public/js/customif"),
    //      test1: require("./public/js/customlist") 
    //     }
}));
app.set('view engine', 'handlebars');

app.use('/', home);
app.use('/employees', emplist);
app.use('/employees', empreg);

//Error handling
app.get('*', function (req, res, next) {
    var err = new Error("Failed to load resource");
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    if (err.status == 404) {
        res.status(404);
        res.render('error', { errorcode: 404 });
        return true;
    } else
        next();
});

// Initiate Server
var port = 1337;
app.listen(port, function () {
    console.log("Server started at port " + port);
});
