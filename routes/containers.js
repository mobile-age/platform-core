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


router.get('/deploy/:app_id/:image_tag', function(req, res, next) {

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

                    url: config.appsVM + '/containers/deploy/' + user + '_' + req.params.app_id + '/' + req.params.image_tag,

                }, function(error, response, body){

                    if(error){
                        
                        send["routerStatus"] = "Failure";
                        send["routerMessage"] = "Error communicating with apps VM";

                        res.json(send);
                    }
                    else{

                        var output = JSON.parse(body);
                        if (output["routerStatus"] == "Success"){

                            dbHandler.dbactions.create_rows(dbcon, 'containers', [['container_id', output["containerId"]], ['image_id', req.params.image_tag], ['developer_id', user], ['active', 1]], function(result){

                                if(result['queryStatus'] == 'Success'){

                                    dbHandler.dbactions.update_table(dbcon, 'applications', [['container_id', output["containerId"]]], [['id', req.params.app_id, 0]], 1, function(result){

                                        if(result['queryStatus'] == 'Success'){

                                            //res.json(output["containerId"]);

                                            dbHandler.dbactions.selectData(dbcon, 'applications', '*', [['id', req.params.app_id, 0]], 1, function(result){

                                                var app_name = result[0]['name'];

                                                request.get({

                                                url: 'http://localhost:5000/repositories/create/' + app_name

                                                }, function(error, response, body){
                                                    
                                                    if (error){
                                                        send["routerStatus"] = "Failure";
                                                        send["routerMessage"] = "Error communicating with apps VM";

                                                        res.json(send);
                                                    }
                                                    else{
                                                        var repo = JSON.parse(body);

                                                        dbHandler.dbactions.create_rows(dbcon, 'app_repos', [['container_id', output["containerId"]], ['project_id', repo['id']], ['developer', user]], function(result){
                                                            
                                                            if(result['queryStatus'] == 'Success'){
                                                                
                                                                send["routerStatus"] = "Success";
                                                                send["routerMessage"] = "Container deployed successfully along with the associated repository";

                                                                res.json(send);
                                                            }
                                                            else{
                                                                send["routerStatus"] = "Failure";
                                                                send["routerMessage"] = "DB query error";

                                                                res.json(send);
                                                            }
                                                        });
                                                    }
                                                });
                                            });
                                        }
                                        else{
                                            send["routerStatus"] = "Failure";
                                            send["routerMessage"] = "DB query error";
                                            
                                            res.json(send);
                                        }
                                    });
                                }
                                else{
                                    
                                    send["routerStatus"] = "Failure";
                                    send["routerMessage"] = "DB query error";
                                    
                                    res.json(send);
                                }
                            });
                        }
                        else{
                            
                            send["routerStatus"] = "Failure";
                            send["routerMessage"] = "Apps VM route failed";

                            res.json(send);
                            
                        }
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


router.get('/preconfList', function(req, res, next) {
    
    var send = {};
    
    dbHandler.dbactions.selectData(dbcon, 'docker_images', '*', [[1, 1, 0]], 1, function(result){

        if (result['queryStatus'] == 'Success'){
            send["routerStatus"] = "Success";
            send["info"] = result;
        }
        else{
            
            send["routerStatus"] = "Failure";
            send["routerMessage"] = "DB query error";
        }
        
        res.json(send);

    });
});

router.get('/preconfList/id/:im_id', function(req, res, next) {

    dbHandler.dbactions.selectData(dbcon, 'docker_images', '*', [['image_id', req.params.im_id, 0]], 1, function(result){

        if (result['queryStatus'] == 'Success'){
            send["routerStatus"] = "Success";
            send["info"] = result;
        }
        else{
            
            send["routerStatus"] = "Failure";
            send["routerMessage"] = "DB query error";
        }
        
        res.json(send);

    });
});


router.get('/:container_id/details', function(req, res, next) {

    var send = {};
    
    dbHandler.dbactions.selectData(dbcon, 'containers', '*', [['container_id', req.params.container_id, 0]], 1, function(result){
        
        if (result['queryStatus'] == 'Success'){
            send["routerStatus"] = "Success";
            
            info = {};
            info["id"] = result['data'][0]["container_id"];
            if (result['data'][0]["active"] > 0){
                info["active"] = "running";
            }
            else{
                info["active"] = "stopped";
            }
            info["image"] = result['data'][0]["image_id"];
            
            send["data"] = info;
            
        }
        else{
            send["routerStatus"] = "Failure";
            send["routerMessage"] = "DB Query failed";
        }
        
        res.json(send);
    });
});

router.get('/start/:container_id', function(req, res, next) {

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

                    url: config.appsVM + '/containers/start/' + req.params.container_id ,

                }, function(error, response, body){
                    
                    if (error){
                                        
                        send["routerStatus"] = "Failure";
                        send["routerMessage"] = "Error communicating with apps VM";

                        res.json(send);
                    }
                    else{
                        
                        var output = JSON.parse(body);

                        if (output["routerStatus"] == "Success"){

                            dbHandler.dbactions.update_table(dbcon, 'containers', [['active', 1]], [['container_id', req.params.container_id, 0]], 1, function(result){

                                if(result['queryStatus'] == 'Success'){
                                    
                                    send["routerStatus"] = "Success";
                                    send["routerMessage"] = "Container started successfully";
                                    
                                    res.json(send);

                                }
                                else{
                                    send["routerStatus"] = "Failure";
                                    send["routerMessage"] = "DB query failure";
                                    
                                    res.json(send);
                                }

                            }); 
                        }
                        else{
                            send["routerStatus"] = "Failure";
                            send["routerMessage"] = "Apps VM route failed";

                            res.json(send);
                        }
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

router.get('/stop/:container_id', function(req, res, next) {

    //var user = req.session.developer;
    var user = 'mobileage';
    
    var send = {};
    
    request.post({
        url: 'http://localhost:5000/developers/isAuth',
        form: {key: user}

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

                    url: config.appsVM + '/containers/stop/' + req.params.container_id ,

                },function(error, response, body){
                    
                    if (error){
                                        
                        send["routerStatus"] = "Failure";
                        send["routerMessage"] = "Error communicating with apps VM";

                        res.json(send);
                    }
                    else{
                        
                        var output = JSON.parse(body);

                        if (output["routerStatus"] == "Success"){

                            dbHandler.dbactions.update_table(dbcon, 'containers', [['active', 0]], [['container_id', req.params.container_id, 0]], 1, function(result){

                                if(result['queryStatus'] == 'Success'){

                                    send["routerStatus"] = "Success";
                                    send["routerMessage"] = "Container stopped successfully";
                                    send["info"] = result;

                                    res.json(send);
                                }
                                else{
                                    send["routerStatus"] = "Failure";
                                    send["routerMessage"] = "DB query failure";

                                    res.json(send);
                                }
                            }); 
                        }
                        else{
                            send["routerStatus"] = "Failure";
                            send["routerMessage"] = "Apps VM route failed";

                            res.json(send);
                        }
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