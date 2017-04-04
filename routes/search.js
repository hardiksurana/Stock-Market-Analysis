var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/dbms_mini_project';

router.get('/', function(req, res, next){
    res.render('search.ejs', {title: "Search Stock"});
});

router.post('/searchS', function(req, res, next) {
    console.log(req);
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var stock_name = req.body;
        console.log(stock_name);
        var col = db.collection('stocks');

        col.find(
            {
                Name: stock_name
            }
        )
        .sort({Date: -1})
        .toArray(function (err, result) {
            assert.equal(null, err);
            res.render('display_search', { title: 'Display Stock', stocks: result });
        });
    });
});

module.exports = router;
