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
var config = require('../config/general_config');

// Authentication
var auth = require('../models/auth');


router.get('/deploy/:app_id/:image_tag/:port', function(req, res, next) {

    //var user = req.session.developer;
    var user = 'mobileage';

    var send = {};

    auth.auth.devIsAuth(dbcon, dbHandler, user, function(result){

        if (result['queryStatus'] == 'Success' && result['isAuth'] == 'true'){

            request.post({

                url: config.appsVM + '/containers/deploy/' + user + '_' + req.params.app_id + '/' + req.params.image_tag + '/' + req.params.port,

            }, function(error, response, body){

                if(error){

                    send["routerStatus"] = "Failure";
                    send["routerMessage"] = "Error communicating with apps VM";

                    res.json(send);
                }
                else{

                    var output = JSON.parse(body);

                    if (output["routerStatus"] == "Success"){

                        send["routerStatus"] = "Success";
                        send["info"]={};
                        send["info"]["container_id"] = output["containerId"];

                    }
                    else{

                        send["routerStatus"] = "Failure";
                        send["routerMessage"] = "Apps VM route failed";

                    }
                    res.json(send);
                }
            });
        }
        else{
            send["routerStatus"] = "Failure";
            send["routerMessage"] = "authentication failed";

            res.json(send);
        }
    });
});

router.get('/availablePort', function(req, res, next) {

    var send = {};

    dbHandler.dbactions.selectData(dbcon, 'containers', '*', [[1, 1, 0]], 1, function(result){

        if (result['queryStatus'] == 'Success'){

            for (i = config.ports_lower_limit; i < config.ports_upper_limit; i++){
                var flag = 0;
                for (j = 0; j< result["data"].length; j++){
                    if(result["data"][j]["port"] == i){
                        flag = 1;
                        break;
                    }
                }
                if(flag == 0){
                    send["routerStatus"] = "Success";
                    send["info"] = {};
                    send["info"]["available_port"] = i;

                    break;
                }
            }
            if (send["routerStatus"] != "Success"){
                send["routerStatus"] = "Failure";
                send["routerMessage"] = "Cannot find available port";
            }
            res.json(send);
        }
        else{

            send["routerStatus"] = "Failure";
            send["routerMessage"] = "DB query error";

            res.json(send);
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

            if (result['data'].length > 0){
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
                send["routerMessage"] = "Container not found";
            }
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

    auth.auth.devIsAuth(dbcon, dbHandler, user, function(result){

        if (result['queryStatus'] == 'Success' && result['isAuth'] == 'true'){

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
    });
});

router.get('/stop/:container_id', function(req, res, next) {

    //var user = req.session.developer;
    var user = 'mobileage';

    var send = {};

    auth.auth.devIsAuth(dbcon, dbHandler, user, function(result){

        if (result['queryStatus'] == 'Success' && result['isAuth'] == 'true'){

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
    });
});


module.exports = router;
