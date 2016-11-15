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

// Containers actions
var containers_actions = require('../models/containers_actions');

// Application actions
var apps_actions = require('../models/apps_actions');

// Repositories actions
var repos_actions = require('../models/repos_actions');

// BD procedures
var db_procedures = require('../models/db_procedures');

router.get('/instantiate/:app_id/:image_tag', function(req, res, next) {

    var user = 'mobileage';

    var send = {};

    auth.auth.devIsAuth(dbcon, dbHandler, user, function(result){

        if (result['queryStatus'] == 'Success' && result['isAuth'] == 'true'){

            containers_actions.containers_actions.get_available_port(function(result){

                if (result["routerStatus"] == "Success"){
                    console.log(result);

                    var port = result["info"]["available_port"];

                    containers_actions.containers_actions.deploy_container(req.params.app_id, req.params.image_tag, port, function(result){

                        if (result["routerStatus"] == "Success"){

                            var container_id = result["info"]["container_id"];

                            apps_actions.apps_actions.get_name_by_id(req.params.app_id, function(result){

                                if (result["routerStatus"] == "Success"){

                                    var app_name = result["info"]["app_name"];

                                    repos_actions.repos_actions.create_repo(app_name, function(result){

                                        if (result["routerStatus"] == "Success"){

                                            db_procedures.db_procedures.init_app(container_id, req.params.image_tag, req.params.app_id, result["info"]["repository_details"]["id"], port, user, function(result){

                                                if (result["routerStatus"] == "Success"){

                                                    send["routerStatus"] = "Success";
                                                    send["routerMessage"] = "Application instantiation performed successfully";

                                                    res.json(send);
                                                }
                                                else{

                                                    send["routerStatus"] = "Failure";
                                                    send["routerMessage"] = "db_procedures.init_app function failed";

                                                    res.json(send);
                                                }
                                            });
                                        }
                                        else{

                                            send["routerStatus"] = "Failure";
                                            send["routerMessage"] = "create_repo function failed";

                                            res.json(send);
                                        }
                                    })

                                }
                                else{

                                    send["routerStatus"] = "Failure";
                                    send["routerMessage"] = "get_name_by_id function failed";

                                    res.json(send);
                                }
                            })
                        }
                        else{

                            send["routerStatus"] = "Failure";
                            send["routerMessage"] = "deploy_container function failed";

                            res.json(send);
                        }
                    });

                }
                else{

                    send["routerStatus"] = "Failure";
                    send["routerMessage"] = "get_available_port function failed";

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

router.get('/name/:app_id', function(req, res, next) {

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
            dbHandler.dbactions.selectData(dbcon, 'applications', '*', [['id', req.params.app_id, 0]], 1, function(result){

                if (error){
                    send["routerStatus"] = "Failure";
                    send["routerMessage"] = "Internal Error";

                    res.json(send);
                }
                else{
                    if(result['queryStatus'] == 'Success'){
                        if (result["data"].length > 0){
                            send["routerStatus"] = "Success";
                            send["info"] = result["data"][0]["name"];
                        }
                        else{
                            send["routerStatus"] = "Failure";
                            send["routerMessage"] = "Application does not exist";
                        }
                    }
                    else{
                        send["routerStatus"] = "Failure";
                        send["routerMessage"] = "BD Query error";
                    }
                    res.json(send);
                }
            });
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

            if (info['routerStatus'] == 'Success' && info['isAuth'] == 'true'){

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
