var express = require('express');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();

// use body-parser as middlware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/dbms_mini_project';

// GET Search Page
app.get('/', function (req, res, next) {
    res.redirect('/search/search_stocks', {title: "Search Stock", stocks: {}, user: req.session.userDetails});
});

// GET Search Page
app.get('/search_stocks', function(req, res, next){
    res.render('search_stock.ejs', {title: "Search Stock", stocks: {}, user: req.session.userDetails});
});

// GET wishlist of user
app.get('/add_to_wishlist', function(req, res, next){
    var user_name = req.session.userDetails.username;
    var stock_name = req.query.stockname;
    MongoClient.connect(url, function(err, db){
        assert.equal(null, err);
        var col = db.collection('users');

        col.update({
            username: user_name
        },{
            $push: {
                wishlist: stock_name
            }
        });
    });
});

// Search for stocks based on given parameters
app.post('/search_stocks', function(req, res) {
    var query = {};

    for(var key in req.body)
        req.body[key] !== "" ? query[key] = req.body[key] : null;

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
                }, {
                    $sort: {
                        date: -1
                    }
                }
            ])
        .toArray(function (err, result) {
            assert.equal(null, err);
            res.render('search_stock.ejs', { title: 'Search Stock', stocks: result, user: req.session.userDetails });
        });
    });
});

// View graph of requested stock based using given parameters
app.get('/stock_data', function(req, res, next) {
    var stock_name = req.query.name;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var col = db.collection('stocks');

        col.find({
              Name: stock_name
            }, {
                Code:0,
               _id: 0,
               Sector: 0,
               Index: 0,
               Name: 0
            })
        .toArray(function(err, result){
            var graphTitle = 'Graph for ' + stock_name;
            assert.equal(null, err);
            res.render('graph.ejs', { title: "Data | " + stock_name, graphTitle: graphTitle, data: result });
        });
    });
});

// GET Top Gainers Page
app.get('/top_gainers', function(req, res, next){
    res.render('top_gainers', {title: "Top Gainers", user: req.session.userDetails, gainers: {}});
});

// GET Top Losers Page
app.get('/top_losers', function(req, res, next){
    res.render('top_losers', {title: "Top Losers", user: req.session.userDetails, losers: {}});
});

// View Top Gainer Stocks for a given sector
app.post('/top_gainers', function(req, res, next) {
    var sector = req.body.sector;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var col = db.collection('stocks');
        col.aggregate([
            {
                $match: {
                    Sector: new RegExp("^" + sector, 'i')
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
            }, {
                $sort: {
                    High: -1
                }
            }
        ])
        .limit(10)
        .toArray(function(err, result){
            assert.equal(null, err);
            res.render('top_gainers', {title: "Top Gainers", user: req.session.userDetails, gainers: result});
        });
    });
});

// View Top Loser Stocks for a given sector
app.post('/top_losers', function(req, res, next) {
    var sector = req.body.sector;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var col = db.collection('stocks');
        col.aggregate([
            {
                $match: {
                    Sector: new RegExp("^" + sector, 'i')
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
            }, {
                $sort: {
                    Low: 1
                }
            }
        ])
        .limit(10)
        .toArray(function(err, result){
            assert.equal(null, err);
            res.render('top_losers', {title: "Top Losers", user: req.session.userDetails, losers: result});
        });
    });
});


module.exports = app;
