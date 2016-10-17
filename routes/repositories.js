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
    
    var send = {};
    
    request.post({
        url: 'http://localhost:5000/developers/isAuth',
        form: {
            key: user
        }
    }, function(error, response, body){
        
        if(error){
            send["routerStatus"] = "Failure";
            send["routerMessage"] = "Internal Error";
            
            res.json(send);
        }
        else{

            var info = JSON.parse(body);
            
            if (info['routerStatus'] == 'Success' && info['isAuth']){
            
                request.post({
                    url: config.appsVM + '/repos/users/username',
                    form:{
                        username: user
                    }
                },function(error, response, body){

                    if (error){

                        send["routerStatus"] = "Failure";
                        send["routerMessage"] = "Error communicating with apps VM";

                        res.json(send);
                    }
                    else{
                        
                        var info = JSON.parse(body);
                         
                        if (info["routerStatus"] == "Success"){
                            
                            if (info['info'].length > 0){
                                
                                request.post({
                                    url: config.appsVM + '/repos/project/create',
                                    form:{
                                        name: req.params.repo_name,
                                        user_id: info["info"][0]['id']
                                    }
                                },function(error, response, body){

                                    if (error){

                                        send["routerStatus"] = "Failure";
                                        send["routerMessage"] = "Error communicating with apps VM";

                                        res.json(send);
                                    }
                                    else{

                                        var out = JSON.parse(body);

                                        if (out["routerStatus"] == "Success"){

                                            send["routerStatus"] = "Success";
                                            send["routerMessage"] = "Repository created successfully";
                                            send["info"] = out;
                                            
                                            res.json(send);
                                        }
                                        else{
                                            send["routerStatus"] = "Failure";
                                            send["routerMessage"] = "Apps VM route failed";
                                            send["info"] = out;

                                            res.json(send);
                                        }
                                    }
                                });
                            }
                            else{
                                send["routerStatus"] = "Failure";
                                send["routerMessage"] = "User not found an apps VM";

                                res.json(send);
                            }
                        }
                        else{
                            
                            send["routerStatus"] = "Failure";
                            send["routerMessage"] = "Apps VM route failed";

                            res.json(send);
                        }
                    }
                });        
            }       
        }
    });
});


module.exports = router;