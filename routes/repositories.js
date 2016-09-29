var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var shell = require('shelljs');
var request = require('request');

// Create connection
var dbcon = require('../models/dbconnect');

// Access database
var dbHandler = require('../models/dbHandler');

// General configuration

var config = require('../general_config');


router.get('/create/:repo_name', function(req, res, next) {
    
    //var user = req.session.developer;
    var user = 'mobileage';

    request.post({
        url: 'http://localhost:5000/developers/isAuth',
        form: {
            key: user
        }
    }, function(error, response, body){
        
        if (body == "\"True\""){

            request.post({
                url: config.appsVM + '/repos/users/username',
                form:{
                    username: user
                }
                
            },function(error, response, body){
                
                if (error){
                    
                    res.json({message:'Error'});
                }
                else{
                    var info = JSON.parse(body);
                    if (info.length == 1){
                        
                        request.post({
                            url: config.appsVM + '/repos/project/create',
                            form:{
                                name: req.params.repo_name,
                                user_id: info[0]['id']
                            }
                        },function(error, response, body){

                            if (error){
                    
                                res.json({message:'Error'});
                            }
                            else{
                                
                                try{
                                    out = JSON.parse(body);
                                    res.json(out[id]);
                                }
                                catch (e){
                                    res.json(body);
                                }
                            }
                        });
                    }
                    else{
                        res.json({message:'User not found in local repository'});
                    }
                }
            });       
        }
    });
});


module.exports = router;