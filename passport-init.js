var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
//var users = require("./data/users.json");
//var _ = require("lodash");

var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var db = require('./models/db');
//var userlist = require('./models/users');

passport.use(new LocalStrategy(function(username, password, done){

console.log(username + "," + password + ", User 0 : ");


  //var user = _.find(users, u => u.name === username);

  db.get().collection('users').findOne({ name: username }, function (err, user) {

   // console.log(username + "," + password + ", User 01 : ");
  
  if(err  || user==undefined){
    console.log(username + "," + password + ", User 11 : ");
  return done(null, false);
}
else
{
  console.log(username + "," + password + ", User 1 : " + user.name + "," + user.password);

  if(!user || user.name !== username){
  console.log(username + "," + password + ", User 2 : " + user.name + "," + user.password);
    return done(null, false); //, { message: 'Incorrect username.' });
  }

  if(!user || user.password !== password){
  console.log(username + "," + password + ", User 3 : " + user.name + "," + user.password);

    return done(null, false);//, { message: 'Incorrect password.' });
  }

  //if(!user && user.name == username && user.password == password)
  //{
     console.log(username + "," + password + ", User 4 : " + user.name + "," + user.password);
     return done(null, user);
  //}
}
});
}
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
 done(null, user);
});