// TODO : Fetch the property(line 21) and the stock_name(line 18) from user.
// The values will automatically plot in the '/graph' route.

var express = require('express');
var router = express.Router();
var assert = require('assert');
var MongoClient = require("mongodb").MongoClient;
var url = 'mongodb://localhost/dbms_mini_project';


router.get('/', function(req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var col = db.collection('stocks');

        col.find
        (
            {
              Name:'Bajaj Auto Limited' //Put the stock_name here
            },
            {
                date:1,Low:1,_id:0 //get the and required property.NOTE : Follow the order given. ie - date:1,property:1,_id:0
            }
        ).toArray(function(err, result){
            assert.equal(null, err);
            res.render('graph', { title: 'Plot Graph For Stock', data: result });
        });
    });
});

module.exports = router;
