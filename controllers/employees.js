var express = require("express");
var router = express.Router();
var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;

//================== Start Mongo DB Connection =================
//Set up default mongoose connection
var conString = 'mongodb://vaskar:12345678@ds161001.mlab.com:61001/mytest_mongodb';
MongoDB.connect(conString, function (err, db) {
    if (err) return console.log('MongoDB connection error: ' + err);
    console.log("Connected to database");
    db.close();
});

//================== Get List of Employees =================
router.get('/list', function (req, res) {
    console.log("l1");
    MongoDB.connect(conString, function (err, db) {
        if (err) return console.log('MongoDB connection error: ' + err);
        db.collection("mytestdb").find().toArray(function (err, results) {
            console.log("l2");
            if (err) {
                console.log("l3");
                console.log(err);
                res.status(500).send();
            } else {
                console.log("l4");
                res.render('employees', { title: 'Employee Page', isEmpAdded: false, employees: results });
            }
        });
        db.close();
    });
});

//================== Save Data =================
router.post("/savedata", function (req, res) {
    console.log("3");

    if (req.body._id != undefined && req.body._id != null) {
        var id = req.body._id;
        var empid = req.body.empid;
        console.log("Save Data : " + id);

        MongoDB.connect(conString, function (err, db) {
            if (err) return console.log('MongoDB connection error: ' + err);

            db.collection('mytestdb').findOne({ _id: ObjectId(id) }, function (err, info) {
                if (err) {
                    console.log("u1");
                    res.status(500).send();
                } else {
                    console.log("u2");
                    console.log(info);
                    db.close();
                    if (info._id != undefined) {
                        console.log("data available to update");

                        MongoDB.connect(conString, function (err, db) {
                            if (err) return console.log('MongoDB connection error: ' + err);
                            console.log("u3");

                            db.collection("mytestdb").save({
                                "_id": ObjectId(info._id),
                                "empid": req.body.empid,
                                "name": req.body.name,
                                "department": req.body.department
                            }, (err, results) => {
                                console.log("u4");
                                if (err) {
                                    console.log("u5");
                                    console.log(err);
                                    res.status(500).send();
                                } else {
                                    db.close();
                                    console.log("Data updated Successfully");
                                    MongoDB.connect(conString, function (err, db) {
                                        if (err) return console.log('MongoDB connection error: ' + err);
                                        db.collection("mytestdb").find().toArray(function (err, results) {
                                            if (err) {
                                                console.log("u6");
                                                console.log(err);
                                                res.status(500).send();
                                            } else {
                                                if (results.length == 0) {
                                                    console.log("u7");
                                                    results = { count: 0 };
                                                    res.render('employees', { title: 'Employee Page', isEmpUpdated: false, employees: results });
                                                } else {
                                                    console.log("u8");
                                                    res.render('employees', { title: 'Employee Page', isEmpUpdated: true, empid: empid, employees: results });
                                                }
                                            }
                                        });
                                        db.close();
                                    });
                                }
                            });
                            db.close();
                        });
                    }
                    else {
                        MongoDB.connect(conString, function (err, db) {
                            if (err) return console.log('MongoDB connection error: ' + err);
                            db.collection("mytestdb").save(req.body, (err, results) => {
                                console.log("4");
                                if (err) {
                                    console.log("5");
                                    console.log(err);
                                    res.status(500).send();
                                } else {
                                    db.close();
                                    console.log("Data Saved Successfully");
                                    MongoDB.connect(conString, function (err, db) {
                                        if (err) return console.log('MongoDB connection error: ' + err);
                                        db.collection("mytestdb").find().toArray(function (err, results) {
                                            if (err) {
                                                console.log("6");
                                                console.log(err);
                                                res.status(500).send();
                                            } else {
                                                if (results.length == 0) {
                                                    console.log("7");
                                                    results = { count: 0 };
                                                    res.render('employees', { title: 'Employee Page', isEmpAdded: false, employees: results });
                                                } else {
                                                    req.body = "";
                                                    console.log("8");
                                                    res.render('employees', { title: 'Employee Page', isEmpAdded: true, employees: results });
                                                }
                                            }
                                        });
                                        db.close();
                                    });
                                }
                            });
                            db.close();
                        });
                    }
                }
            });
            db.close();
        });
    }
    else {
        MongoDB.connect(conString, function (err, db) {
            if (err) return console.log('MongoDB connection error: ' + err);
            db.collection("mytestdb").save(req.body, (err, results) => {
                console.log("4");
                if (err) {
                    console.log("5");
                    console.log(err);
                    res.status(500).send();
                } else {
                    db.close();
                    console.log("Data Saved Successfully");
                    MongoDB.connect(conString, function (err, db) {
                        if (err) return console.log('MongoDB connection error: ' + err);
                        db.collection("mytestdb").find().toArray(function (err, results) {
                            if (err) {
                                console.log("6");
                                console.log(err);
                                res.status(500).send();
                            } else {
                                if (results.length == 0) {
                                    console.log("7");
                                    results = { count: 0 };
                                    res.render('employees', { title: 'Employee Page', isEmpAdded: false, employees: results });
                                } else {
                                    req.body = "";
                                    console.log("8");
                                    res.render('employees', { title: 'Employee Page', isEmpAdded: true, employees: results });
                                }
                            }
                        });
                        db.close();
                    });
                }
            });
            db.close();
        });
    }
});

//================== Delete Employee =================
router.get('/delete/:_id', function (req, res) {
    console.log("d1");

    var id = req.params._id;
    var empid = "";

    MongoDB.connect(conString, function (err, db) {
        if (err) return console.log('MongoDB connection error: ' + err);

        db.collection('mytestdb').findOne({ _id: ObjectId(id) }, function (err, info) {
            if (err) {
                console.log("d2");
                res.status(500).send();
            } else {
                console.log("d3");
                console.log(info);
                db.close();
                if (info._id != undefined) {
                    empid = info.empid;

                    MongoDB.connect(conString, function (err, db) {
                        if (err) return console.log('MongoDB connection error: ' + err);
                        db.collection('mytestdb', {}, function (err, contacts) {
                            contacts.remove({ _id: ObjectId(id) }, function (err, docs) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    db.close();

                                    console.log("Record deleted Successfully");
                                    MongoDB.connect(conString, function (err, db) {
                                        if (err) return console.log('MongoDB connection error: ' + err);
                                        db.collection("mytestdb").find().toArray(function (err, results) {
                                            if (err) {
                                                console.log("d6");
                                                console.log(err);
                                                res.status(500).send();
                                            } else {
                                                console.log("d8");
                                                res.render('employees', { title: 'Employee Page', isEmpDeleted: true, empid: empid, employees: results });
                                            }
                                        });
                                        db.close();
                                    });
                                }
                            });
                        });
                        db.close();
                    });
                }
            }
        });
    });
});

//================== Edit Employee =================
router.get('/edit/:_id', function (req, res) {
    console.log("id : " + req.params._id);

    var id = req.params._id;

    MongoDB.connect(conString, function (err, db) {
        if (err) return console.log('MongoDB connection error: ' + err);

        db.collection('mytestdb').findOne({ _id: ObjectId(id) }, function (err, info) {
            if (err) {
                console.log("e1");
                res.status(500).send();
            } else {
                console.log("e2");
                console.log(info);
                res.render('editemployee', { title: 'Edit Employee', employees: info });
            }
        });
        db.close();
    });
});

function getData() {

}

module.exports = router;