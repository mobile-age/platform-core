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
            errorsMessage: 'Bad credentials'
        });
    }
    else if(req.query.code == 'error_01'){
        res.render('developers/signin', {
            errorsMessage: 'Cannot connect to database - Please try again'
        });
    }
    else if(req.query.code == 'error_02'){
        res.render('developers/signin', {
            errorsMessage: 'Internal error'
        });
    }
    else {
        res.render('developers/signin', {
        });
    }

});

router.post('/authenticate', function(req, res, next) {

    req.checkBody('username', "Username can't be empty").notEmpty();
    req.checkBody('password', "Password can't be empty").notEmpty();

    const errors = req.validationErrors();
    if (errors){
        res.render('developers/signin', {
            message: errors
        });
    }
    else{

        dbHandler.dbactions.checkIfExists(dbcon, 'developers', req.body.username, req.body.password, function(result){

            if(typeof result == 'object'){

                req.session.developer = result[0]['username'];
                //console.log(result);

                return res.redirect('/developers/dashboard');
            }
            else if(result == false){

                return res.redirect('/developers/signin?code=bad_cred');
            }
            else{

                return res.redirect('/developers/signin?code=' + result);

            }
        });
    }
});


router.post('/isAuth', function(req, res, next) {
    
    username = req.body.key;
    
    var send = {};
    
    dbHandler.dbactions.selectData(dbcon, 'developers', '*', [['username', username, 0]], 1, function(result){
        
        if(result['queryStatus'] == 'Success'){

            if(result['data'].length > 0){
                send["routerStatus"] = "Success";
                send["isAuth"] = "true";
            }
            else{
                send["routerStatus"] = "Success";
                send["isAuth"] = "false"; 
            }
        
        }
        else{
            send["routerStatus"] = "Failure";
            send["routerMessage"] = "BD Query error";
        }

        res.json(send);
    });
});

router.get('/update', function(req, res, next) {
    
    dbHandler.dbactions.update_table(dbcon, 'developers', [['password','mobileage']], [['username', 'mobleage', 0]], 1, function(result){
        
        if(typeof result == 'object'){
            
            res.json(result);
            
        }
        else{
            res.json('False');
        }
        
    });
    
});

router.get('/create', function(req, res, next) {
    
    dbHandler.dbactions.create_rows(dbcon, 'developers', [['username', 'test'], ['password','test'], ['email','pp']], function(result){
        
        if(typeof result == 'object'){
            
            res.json(result);
            
        }
        else{
            res.json(result);
        }
        
    });
    
});


router.get('/dashboard', function(req, res, next) {

  res.render('developers/dashboard', {
    login: true
  });

});

module.exports = router;
