var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
// var router = express.Router();

var app = express();
app.use(session({
    secret: 'stockmarket',
    resave: true,
    saveUninitialized: true
}));

// use bodyParser as middlware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var sess;

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/dbms_mini_project';

app.get('/', function(req, res) {
    sess = req.session;
    res.render('login', { title: 'Trade Tiger - Stock Market Analysis'});
});

app.post('/login', function(req, res, next) {
    sess = req.session;
    if (!req.body.email || !req.body.password)
        res.redirect('/login');

    sess.email = req.body.email;
    sess.password = req.body.password;

    if (req.body.email === 'h@gmail.com' && req.body.password === '1234') {
        sess.username = req.body.email;
        res.redirect('/search/search_stocks');
    } else {
        res.redirect('/users');
    }
});

app.get('/logout', function (req, res) {
    req.session.destroy(function(err) {
    if(err)
        console.log(err);
    else
        res.redirect('/');
    });
});
module.exports = app;
