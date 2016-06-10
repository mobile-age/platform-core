var express = require('express');
var router = express.Router();

var con = require('../models/dbconnect');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/signIn', function(req, res, next) {
    
    res.render('developers/signin', {
            
    });
    
});


router.post('/authenticate', function(req, res, next) {
    
    
    req.checkBody('username', 'username cant be empty').notEmpty();
    //res.send('signIn proceedure');
    const errors = req.validationErrors();
    if (errors){
        res.render('developers/signin', {
            message: errors
        });
    }
    else{
        res.render('developers/signin', {
            
        });
    }
    
});

module.exports = router;