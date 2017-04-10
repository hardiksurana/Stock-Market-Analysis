var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// use bodyParser as middlware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var sess;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/dbms_mini_project';

app.get('/', function(req, res, next) {
    res.render('login', { title: 'Stock Market Analysis'});
});

app.post('/signup', function(req, res, next) {
    if (!req.body.email || !req.body.password) {
        res.redirect('/users');
    }

    MongoClient.connect(url, function(err, db) {
       assert.equal(null, err);
       var col = db.collection('users');

       col.insertOne({
           username: req.body.username,
           email: req.body.email,
           password:req.body.password,
           wishlist: []
       }, function(err, user){
            assert.equal(err, null);
            console.log("user has been signed up!");
            res.render('login', { title: 'Stock Market Analysis'});
        });
    });

});


app.post('/login', function(req, res, next) {
    sess = req.session;

    if (!req.body.email || !req.body.password) {
        res.redirect('/users');
    }

    sess.email = req.body.email;
    sess.pass = req.body.password;

    MongoClient.connect(url, function(err, db) {
       assert.equal(null, err);
       var col = db.collection('users');

       col.findOne({
           email: req.body.email
       }, function(err, user){
            if(!user){
               res.redirect('/users');
            }
            else {
                if(req.body.password === user.password){
                    sess.userDetails = user;
                    res.redirect('/search/search_stocks');
                }
            }
       });
    });

});

app.get('/dashboard', function (req, res, next) {
    var user = req.session.userDetails;
    console.log(user.username);

    MongoClient.connect(url, function(err, db){
        assert.equal(null, err);
        var col = db.collection('users');

        col.find({
            username: user.username
        })
        .toArray(function(err, result){
            assert.equal(null, err);
            console.log(result[0].wishlist);
            res.render('dashboard.ejs', {title: 'Dashboard', user: req.session.userDetails, wishlist: result[0].wishlist});
        });
    });
});

app.get('/logout', function (req, res, next) {
    req.session.destroy(function(err){
		if(err)
			console.log(err);
		else
			res.redirect('/');
	});
});

module.exports = app;
