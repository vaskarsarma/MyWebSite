var db = require('../models/db');

exports.emplist = function(cb) {
    var collection = db.get().collection("mytestdb");

    collection.find().toArray(function(err, results) {
        cb(err, results);
    });
}

