var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;

var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
//var db = require('./models/db');
var data = require('../models/users');

module.exports = function(passport){

const user = {  
  username: 'vaskar',
  password: 'vaskar',
  id: 1
}

passport.use(new LocalStrategy(  
  function(username, password, done) {
    findUser(username, function (err, user) {

        console.log(username);
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(null, false)
      }
      if (password !== user.password  ) {
        return done(null, false)
      }
      return done(null, user)
    })
  }
))    
}