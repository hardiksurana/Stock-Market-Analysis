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

router.get('/', function(req, res, next) {
    res.render('login', { title: 'Stock Market Analysis'});
});

router.post('/login', function(req, res, next) {


    res.redirect('/search/search_stocks');
});

module.exports = router;
