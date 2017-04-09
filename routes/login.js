var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var router = express.Router();

var app = express();

// create session
app.use(session({
    secret: 'cookie_secret',
    resave: true,
    saveUninitialized: true
}));

// use bodyParser as middlware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/dbms_mini_project';

router.get('/', function(req, res, next) {
    res.render('login', { title: 'Stock Market Analysis'});
});

router.post('/login', function(req, res, next) {
    var sess = req.session;
    console.log(sess);
    if (!req.body.email || !req.body.password) {
        res.redirect('/users');
    }
    if (req.body.email === 'h@gmail.com' && req.body.password === '1234') {
        sess.username = req.body.email;
        // alert('login success');
        res.redirect('/search/search_stocks');
    } else {
        res.redirect('/users');
    }


});

app.get('/logout', function (req, res, next) {
    req.session.destroy();
    alert('logout success');
    res.redirect('/');
});

module.exports = router;
