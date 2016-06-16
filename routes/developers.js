var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var credentials = require('../db-credentials')


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/signIn', function(req, res, next) {
    
    res.render('developers/signin', {
            
    });
    
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
        
        //var con = require('../models/dbconnect');
        var con = mysql.createConnection({
    
            host: credentials.host,
            user: credentials.user,
            password: credentials.password,
            database: credentials.db

        });
        con.connect(function(err){
            
            if (!err){
                
                console.log('Successful connection');
                con.query("select * from dev WHERE username='" + req.body.username +"'&&email='" + req.body.password + "';", function(err, rows){
                    console.log(req.body.password);
                    console.log(req.body.username);
                    if(err){
                        console.log("DB query error");
                        console.log(err);
                    }
                    else{
                        console.log(rows.length);
                        if (rows.length > 0){
                            res.redirect('/developers/container');
                        }
                        else{
                            con.end();
                            res.render('developers/signin', { errorsMessage: 'Bad Credentials' });
                        }
                    }
                });
            }
            else{
                console.log('Connection with database error occurred');
                console.log(err);
            }

        });
        
    }
    
});


router.get('/container', function(req, res, next) {
  res.send('developer container configuration');
});


module.exports = router;