var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var users = require("./data/users.json");
var _ = require("lodash");

passport.use(new LocalStrategy(function(username, password, done){
  var user = _.find(users, u => u.name === username);

  if(!user || user.password !== password){
    done(null, false);
    return;
  }

  done(null, user);
}));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});


// var login = require('./login');
// //var signup = require('./signup');
// //var db = require('../../models/db');
// //var data = require('../models/users');
// var users = require("./data/users.json");
// var _ = require("lodash");

// module.exports = function(passport){

// 	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
//     passport.serializeUser(function(user, done) {
//         console.log('serializing user: ');console.log(user);
//         done(null, user._id);
//     });

//     passport.deserializeUser(function(id, done) {
//         users.findById(id, function(err, user) {
//             console.log('deserializing user:',user);
//             done(err, user);
//         });
//     });

//     // Setting up Passport Strategies for Login and SignUp/Registration
//     login(passport);
//     //signup(passport);

// }