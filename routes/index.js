var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Trade Tiger - Stock Market Analysis'});
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Trade Tiger - Stock Market Analysis'});
});


module.exports = router;
