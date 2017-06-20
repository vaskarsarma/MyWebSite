var express = require("express");
var router = express.Router();
module.exports = router;

var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var db = require('../models/db');
var data = require('../models/users');

router.use(function (req, res, next) {
  if (req.user.admin) {
    next();
    return;
  }
  res.redirect("/login");
});

//================== Get List of Employees =================
router.get('/', function (req, res) {
    console.log("u1");
    data.users(function (err, results) {
        console.log("u2");
        if (err) {
            console.log("u3" + err);
            res.status(500).send();
        } else {
            console.log("u4");
            //res.send(results);
            res.render('users', { title: 'user Page', isUserAdded:'false', users: results });
        }
    });
});

//================== Get List of Employees =================
router.get('/list', function (req, res) {
    console.log("u1");
    data.users(function (err, results) {
        console.log("u2");
        if (err) {
            console.log("u3" + err);
            res.status(500).send();
        } else {
            console.log("u4");
            //res.send(results);
            res.render('users', { title: 'user Page', isUserAdded:'false', users: results });
        }
    });
});

//================== Add Employee ==================================
router.get("/add", function (req, res) {
    res.render("adduser", { title: "Add User" });
});


//================== Save Data =================
router.post("/savedata", function (req, res) {
    console.log("3");

    if (req.body._id != undefined && req.body._id != null) {
        var id = req.body._id;
        var name = req.body.name;
        console.log("Save Data : " + id);

        db.get().collection('users').findOne({ _id: ObjectId(id) }, function (err, info) {
            if (err) {
                console.log("u1");
                res.status(500).send();
            } else {
                console.log("u2");
                console.log(info);
                if (info._id != undefined) {
                    console.log("data available to update");
                    console.log("u3");

                    db.get().collection("users").save({
                        "_id": ObjectId(info._id),
                        "name": req.body.name,
                        "password": req.body.password,
                        "admin": req.body.admin
                    }, (err, results) => {
                        console.log("u4");
                        if (err) {
                            console.log("u5");
                            console.log(err);
                            res.status(500).send();
                        } else {
                            console.log("Data updated Successfully");
                            data.users(function (err, results) {
                                if (err) {
                                    console.log("u6");
                                    console.log(err);
                                    res.status(500).send();
                                } else {
                                    if (results.length == 0) {
                                        console.log("u7");
                                        results = { count: 0 };
                                        res.render('users', { title: 'User Page', isUserUpdated: false, users: results });
                                    } else {
                                        console.log("u8");
                                        res.render('users', { title: 'User Page', isUserUpdated: true, name: name, users: results });
                                    }
                                }
                            });
                        }
                    });
                } else {
                    db.get().collection("users").save(req.body, (err, results) => {
                        console.log("4");
                        if (err) {
                            console.log("5");
                            console.log(err);
                            res.status(500).send();
                        } else {
                            console.log("Data Saved Successfully");
                            data.users(function (err, results) {
                                if (err) {
                                    console.log("6");
                                    console.log(err);
                                    res.status(500).send();
                                } else {
                                    if (results.length == 0) {
                                        console.log("7");
                                        results = { count: 0 };
                                        res.render('users', { title: 'User Page', isUserAdded: false, users: results });
                                    } else {
                                        req.body = "";
                                        console.log("8");
                                        res.render('users', { title: 'User Page', isUserAdded: true, users: results });
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    } else {
        console.log("admin save data");
        db.get().collection("users").save(req.body, (err, results) => {
            console.log("4");
            if (err) {
                console.log("5");
                console.log(err);
                res.status(500).send();
            } else {
                console.log("Data Saved Successfully");
                data.users(function (err, results) {
                    if (err) {
                        console.log("6");
                        console.log(err);
                        res.status(500).send();
                    } else {
                        if (results.length == 0) {
                            console.log("7");
                            results = { count: 0 };
                            res.render('users', { title: 'User Page', isUserAdded: false, users: results });
                        } else {
                            req.body = "";
                            console.log("8");
                            res.render('users', { title: 'User Page', isUserAdded: true, users: results });
                        }
                    }
                });
            }
        });
    }
    //}
    //});
});

//================== Delete User =================
router.get('/delete/:_id', function (req, res) {
    console.log("d1");

    var id = req.params._id;
    var name = "";

    db.get().collection('users').findOne({ _id: ObjectId(id) }, function (err, info) {
        if (err) {
            console.log("d2");
            res.status(500).send();
        } else {
            console.log("d3");
            console.log(info);
            if (info._id != undefined) {
                name = info.name;

                db.get().collection('users', {}, function (err, contacts) {
                    contacts.remove({ _id: ObjectId(id) }, function (err, docs) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Record deleted Successfully");
                            data.users(function (err, results) {
                                if (err) {
                                    console.log("d6");
                                    console.log(err);
                                    res.status(500).send();
                                } else {
                                    console.log("d8");
                                    res.render('users', { title: 'User Page', isUserDeleted: true, name: name, users: results });
                                }
                            });
                        }
                    });
                });
            }
        }
    });
});

//================== Edit User =================
router.get('/edit/:_id', function (req, res) {
    console.log("id : " + req.params._id);

    var id = req.params._id;

    db.get().collection('users').findOne({ _id: ObjectId(id) }, function (err, info) {
        if (err) {
            console.log("e1");
            res.status(500).send();
        } else {
            console.log("e2");
            console.log(info);
            res.render('edituser', { title: 'Edit User', users: info });
        }
    });
});