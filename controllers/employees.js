var express = require("express");
var router = express.Router();
var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;

var db = require('../models/db');
var data = require('../models/empdetails');

//================== Get List of Employees =================
router.get('/list', function(req, res) {
    console.log("l1");
    data.emplist(function(err, results) {
        console.log("l2");
        if (err) {
            console.log("l3");
            res.status(500).send();
        } else {
            console.log("l4");
            res.render('employees', { title: 'Employee Page', isEmpAdded: false, employees: results });
        }
    });
});

//================== Save Data =================
router.post("/savedata", function(req, res) {
    console.log("3");

    if (req.body._id != undefined && req.body._id != null) {
        var id = req.body._id;
        var empid = req.body.empid;
        console.log("Save Data : " + id);

        db.get().collection('mytestdb').findOne({ _id: ObjectId(id) }, function(err, info) {
            if (err) {
                console.log("u1");
                res.status(500).send();
            } else {
                console.log("u2");
                console.log(info);
                if (info._id != undefined) {
                    console.log("data available to update");
                    console.log("u3");

                    db.get().collection("mytestdb").save({
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
                            console.log("Data updated Successfully");
                            data.emplist(function(err, results) {
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
                        }
                    });
                } else {
                    db.get().collection("mytestdb").save(req.body, (err, results) => {
                        console.log("4");
                        if (err) {
                            console.log("5");
                            console.log(err);
                            res.status(500).send();
                        } else {
                            console.log("Data Saved Successfully");
                            data.emplist(function(err, results) {
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
                        }
                    });
                }
            }
        });
    } else {
        db.get().collection("mytestdb").save(req.body, (err, results) => {
            console.log("4");
            if (err) {
                console.log("5");
                console.log(err);
                res.status(500).send();
            } else {
                console.log("Data Saved Successfully");
                data.emplist(function(err, results) {
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
            }
        });
    }
});

//================== Delete Employee =================
router.get('/delete/:_id', function(req, res) {
    console.log("d1");

    var id = req.params._id;
    var empid = "";

    db.get().collection('mytestdb').findOne({ _id: ObjectId(id) }, function(err, info) {
        if (err) {
            console.log("d2");
            res.status(500).send();
        } else {
            console.log("d3");
            console.log(info);
            if (info._id != undefined) {
                empid = info.empid;

                db.get().collection('mytestdb', {}, function(err, contacts) {
                    contacts.remove({ _id: ObjectId(id) }, function(err, docs) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Record deleted Successfully");
                            data.emplist(function(err, results) {
                                if (err) {
                                    console.log("d6");
                                    console.log(err);
                                    res.status(500).send();
                                } else {
                                    console.log("d8");
                                    res.render('employees', { title: 'Employee Page', isEmpDeleted: true, empid: empid, employees: results });
                                }
                            });
                        }
                    });
                });
            }
        }
    });
});

//================== Edit Employee =================
router.get('/edit/:_id', function(req, res) {
    console.log("id : " + req.params._id);

    var id = req.params._id;

    db.get().collection('mytestdb').findOne({ _id: ObjectId(id) }, function(err, info) {
        if (err) {
            console.log("e1");
            res.status(500).send();
        } else {
            console.log("e2");
            console.log(info);
            res.render('editemployee', { title: 'Edit Employee', employees: info });
        }
    });
});

module.exports = router;