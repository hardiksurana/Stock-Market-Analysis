var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/dbms_mini_project';

/* GET stocks listing. */
router.get('/', function(req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var col = db.collection('stocks');

        col.aggregate([
            {
                $group: {
                    _id: "$Name",
                    date: {$last: '$date'},
                    High: {$last: '$High'},
                    Low: {$last: '$Low'},
                    Turnover_in_Lakhs: {$last: "$Turnover_in_Lakhs"}
                }
            }
        ]).toArray(function(err, result){
            assert.equal(null, err);
            res.render('stocks', { title: 'Stock Data', stocks: result });
        });
    });
});

/* GET stocks by Name. */
router.get('/byName', function(req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var col = db.collection('stocks');
        col.find(
            {Name: "Tata Consultancy Services Limited"})
            .sort({Date: -1})
            .toArray(function (err, result) {
                assert.equal(null, err);
                res.render('stocks_general', { title: 'Stock Data', stocks: result });
        });
    });
});

/* GET stocks by Range of High. */
router.get('/high', function(req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var col = db.collection('stocks');
            col.aggregate([
                {
                    $match: {
                        High: {
                            $gt: 300, $lt: 400
                        }
                    }
                },
                {
                    $group: {
                        _id: "$Name",
                        date: {$last: '$date'},
                        High: {$last: '$High'},
                        Low: {$last: '$Low'},
                        Turnover_in_Lakhs: {$last: "$Turnover_in_Lakhs"}
                    }
                }
            ])
            .toArray(function (err, result) {
                assert.equal(null, err);
                res.render('stocks', { title: 'Stock Data', stocks: result });
        });
    });
});

router.get('/turnover', function(req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var col = db.collection('stocks');
            col.aggregate([
                {
                    $match: {
                        "Turnover_in_Lakhs": {
                            $gt: 1000, $lt: 2000
                        }
                    }
                },
                {
                    $group: {
                        _id: "$Name",
                        date: {$last: '$date'},
                        High: {$last: '$High'},
                        Low: {$last: '$Low'},
                        Turnover_in_Lakhs: {$last: "$Turnover_in_Lakhs"}
                    }
                }
            ])
            .toArray(function (err, result) {
                assert.equal(null, err);
                res.render('stocks', { title: 'Stock Data', stocks: result });
        });
    });
});


module.exports = router;
