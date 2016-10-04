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


router.get('/add/:name', function(req, res, next) {
    
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
            
            if (info['routerStatus'] == 'Success' && info['isAuth'] == 'true'){

                dbHandler.dbactions.create_rows(dbcon, 'applications', [['name', req.params.name], ['developer', user], ['container_id','not_assigned']], function(result){

                    if (result['queryStatus'] == 'Success'){
                        send["routerStatus"] = "Success";
                        send["routerMessage"] = "Application Created Successfully";
                        send["info"] = result;
                        
                    }
                    else{
                        send["routerStatus"] = "Failure";
                        send["routerMessage"] = "BD Query error";
            
                    }
                    
                    res.json(send);
                });
            }
            else{
                send["routerStatus"] = "Failure";
                send["routerMessage"] = "authentication failed";
                
                res.json(send);
            }
        }
    });
});

router.get('/my_apps', function(req, res, next) {

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
            if (info['routerStatus'] == 'Success' && info['isAuth'] == 'true'){

                dbHandler.dbactions.selectData(dbcon, 'applications', '*', [['developer', user, 0]], 1, function(result){

                    if (result['queryStatus'] == 'Success'){
                        send["routerStatus"] = "Success";
                        send["info"] = result;

                    }
                    else{
                        send["routerStatus"] = "Failure";
                        send["routerMessage"] = "BD Query error";

                    }
                    res.json(send);
                });
            }
            else{
                send["routerStatus"] = "Failure";
                send["routerMessage"] = "authentication failed";

                res.json(send);
            }
        } 
    });
});

router.get('/info/:app_id', function(req, res, next) {

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

                dbHandler.dbactions.selectData(dbcon, 'applications', '*', [['id', req.params.app_id, 0]], 1, function(result){

                    if(result['queryStatus'] == 'Success' && result['data'].length == 1){

                        dbHandler.dbactions.selectData(dbcon, 'app_repos', '*', [['container_id', result['data'][0]['container_id'], 0]], 1, function(out){

                            if(out['queryStatus'] == 'Success' && out['data'].length == 1){

                                request.post({
                                    url: config.appsVM + '/repos/project/info',
                                    form:{
                                        project_id: out['data'][0]['project_id']
                                    }
                                },function(error, response, body){

                                    if (error){
                                        
                                        send["routerStatus"] = "Failure";
                                        send["routerMessage"] = "Error communicating with apps VM";

                                        res.json(send);
                                    }
                                    else{
                                        
                                        send["routerStatus"] = "Success";
                                        send["info"] = JSON.parse(body);
                                        
                                        res.json(send);
                                    }
                                });
                            }
                            else{
                                
                                send["routerStatus"] = "Failure";
                                send["routerMessage"] = "Repository not found";
                                
                                res.json(send);
                            }
                        });
                    }
                    else{
                        send["routerStatus"] = "Failure";
                        send["routerMessage"] = "Application not found";
                                
                        res.json(send);
                        
                    }
                });

            }
            else{
                send["routerStatus"] = "Failure";
                send["routerMessage"] = "authentication failed";

                res.json(send);
            }   
        }
    });
});

module.exports = router;