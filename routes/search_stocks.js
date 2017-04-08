var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var app = express();

// use body-parser as middlware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/dbms_mini_project';

router.get('/', function(req, res, next){
    res.redirect('/search/search_stocks');
});

router.get('/search_stocks', function(req, res, next){
    res.render('search_stock.ejs', {title: "Search Stock", stocks: {}});
});

router.get('/stock_data', function(req, res, next){
    var stock_name = req.query.name;
    console.log(stock_name);

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var col = db.collection('stocks');
        col.aggregate([
            {
                $match: {
                Name: stock_name
                }
            }, {
                $group: {
                    _id: "$Name",
                    date: {
                        $last: '$date'
                    },
                    Low: {
                        $last: '$Low'
                    },
                    High: {
                        $last: '$High'
                    },
                    Turnover_in_Lakhs: {
                        $last: "$Turnover_in_Lakhs"
                    },
                    Total_Trade_Quantity: {
                        $last: "$Total_Trade_Quantity"
                    }
                }
            }
        ])
        .toArray(function (err, result) {
            assert.equal(null, err);
            res.render('stock_data.ejs', {title: req.params.name, stocks: result});
        });
    });
});

router.post('/search_stocks', function(req, res) {
    var query = {};

    for(var key in req.body)
        req.body[key] !== "" ? query[key] = req.body[key] : null;

    console.log(query);

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var col = db.collection('stocks');

        col.aggregate([
                {
                    $match: {
                        $or: [
                            {
                                Name: new RegExp("^" + query["name"], 'i')
                            },
                            {
                                Sector: new RegExp("^" + query["sector"], 'i')
                            },
                            {
                                Low: {$gt: query["low_min"], $lt: query["low_max"]}
                            },
                            {
                                High: {$gt: query["high_min"], $lt: query["high_max"]}
                            },
                            {
                                Turnover_in_Lakhs: {$gt: query["turnover_min"], $lt: query["turnover_max"]}
                            },
                            {
                                Total_Trade_Quantity: {$gt: query["quantity_min"], $lt: query["quantity_max"]}
                            }
                        ]
                    }
                },
                {
                    $group: {
                        _id: "$Name",
                        date: {
                            $last: '$date'
                        },
                        Low: {
                            $last: '$Low'
                        },
                        High: {
                            $last: '$High'
                        },
                        Turnover_in_Lakhs: {
                            $last: "$Turnover_in_Lakhs"
                        },
                        Total_Trade_Quantity: {
                            $last: "$Total_Trade_Quantity"
                        }
                    }
                },
                {
                    $sort: {
                        date: -1
                    }
                }
            ])
        .toArray(function (err, result) {
            assert.equal(null, err);
            res.render('search_stock.ejs', { title: 'Search Stock', stocks: result });
        });
    });

});

module.exports = router;
