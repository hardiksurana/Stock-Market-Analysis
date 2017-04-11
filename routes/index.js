var express = require('express');
var router = express.Router();

var app = express();

// GET home page.
app.get('/', function(req, res, next) {
    res.render('index', { title: 'Stock Market Analysis'});
});

// GET signup and login page.
app.post('/', function(req, res, next) {
    res.render('login', { title: 'Stock Market Analysis'});
});

module.exports = app;
