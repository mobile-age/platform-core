var express = require('express');
var router = express.Router();
var mysql = require('mysql');

// Create connection
var dbcon = require('../models/dbconnect');

// Access database
var dbHandler = require('../models/dbHandler');


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/signIn', function(req, res, next) {
    
    if(req.query.code == 'bad_cred'){
        res.render('developers/signin', {
            errorsMessage: 'bad credentials'
        });
    }
    else{
        res.render('developers/signin', {
            
        });
    }
    
});


router.post('/authenticate', function(req, res, next) {
    
    req.checkBody('username', "username can't be empty").notEmpty();
    req.checkBody('password', "password can't be empty").notEmpty();

    const errors = req.validationErrors();
    if (errors){
        res.render('developers/signin', {
            message: errors
        });
    }
    else{
        
        dbHandler.dbactions.checkIfExists(dbcon, 'dev', req.body.username, req.body.password, function(result){
    
            if(result){
               
                return res.redirect('/developers/container');
            }
            else{
                
                return res.redirect('/developers/signin?code=bad_cred');
            }

        });
        
    }
    
});


router.get('/container', function(req, res, next) {
  res.send('developer container configuration');
});


module.exports = router;