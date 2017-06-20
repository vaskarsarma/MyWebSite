var express = require("express");
var app = express();
var path = require("path");
var hbs = require("express-handlebars");
var bodyparser = require("body-parser");
var db = require('./models/db');
//var expressValidator = require('express-validator');

//app.use(require("cookie-parser"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

//app.use(expressValidator());

app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
//app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));

app.engine('handlebars', hbs({
    defaultLayout: 'layout'
    // Example to use custom helper function for HandleBar
    , helpers: {
        CheckEmpty: require("./public/js/customcheckempty"),
        CheckNumber: require("./public/js/customchecknumber"),
        IsAdmin: require("./public/js/isadmin"),
        CheckIsAdmin: require("./public/js/checkisadmin"),
        EditEmployee: require("./public/js/editemployee")
    }
}));
app.set('view engine', 'handlebars');

require("./passport-init");

// Configuring Passport
var passport = require("passport");
var expressSession = require('express-session');
app.use(require('express-session')({
  secret: 'keyboard cat', resave: false, saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
//var flash = require('connect-flash');
//app.use(flash());

// Initialize Passport
// var initPassport = require('./passport/init');
// initPassport(passport);

var authRouter = require('./controllers/authroute');
app.use('/', authRouter);


var forgotpwd = require('./controllers/forgotpwd');
app.use('/', forgotpwd);
// app.get("/login", function (req, res) {
//   console.log("login get");
//   res.render('login', { title: 'Login Page' });
// }); 

// app.post('/login', passport.authenticate('local', 
//                                             { successRedirect: '/',
//                                               failureRedirect: '/login' 
//                                             })
//         );

// app.get('/logout', function (req, res) {
//   req.logout();
//   res.redirect('/login');
// });

app.use(function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
    next();
    return;
  }
  res.redirect("/login");
});

// app.get("/login", function (req, res) {
//   console.log("lgin");
//   res.render("login");
// });

// app.use(function (req, res, next) {
//    if (req.isAuthenticated()) {
//     res.locals.user = req.user;
//     next();
//     return;
//   }
//   res.redirect("/login");
// });

// Initialize Passport
//var initPassport = require('./passport-init').(passport);

// app.get('/', function (req, res) {
//   res.render("home", {title: "Home"});
// });

var homeroute = require('./controllers/home');
app.use("/", homeroute);

var emplistroute = require('./controllers/employees');
app.use("/employees",emplistroute);

var empregroute = require('./controllers/addemployee');
app.use("/employees",empregroute);

var adminroute=require('./controllers/adminroute');
app.use("/admin",adminroute);

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

// Connect to Mongo on start
db.connect(db.url, function (err) {
    if (err) {
        console.log('Unable to connect to Mongo.')
        process.exit(1)
    } else {
        console.log("Connected to database");
        // Initiate Server
        var port = 1337;
        app.listen(port, function () {
            console.log("Server started at port " + port);
        });
    }
});

module.exports = app;
