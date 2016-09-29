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

    request.post({
        url: 'http://localhost:5000/developers/isAuth',
        form: {key: user}

    }, function(error, response, body){

        if (body == "\"True\""){

            dbHandler.dbactions.create_rows(dbcon, 'applications', [['name', req.params.name], ['developer', user], ['container_id','not_assigned']], function(result){
        
                res.json(result);

            });

        }
        else{
            res.json('authentication failed');
        }

    });
    
});

router.get('/my_apps', function(req, res, next) {

    //var user = req.session.developer;
    var user = 'mobileage';

    request.post({
        url: 'http://localhost:5000/developers/isAuth',
        form: {
            key: user
        }
    }, function(error, response, body){

        if (body == "\"True\""){

            dbHandler.dbactions.selectData(dbcon, 'applications', '*', [['developer', user, 0]], 1, function(result){

                res.json(result);

            });

        }
        else{
            res.json('authentication failed');
        }

    });
    
});

router.get('/info/:app_id', function(req, res, next) {

    //var user = req.session.developer;
    var user = 'mobileage';

    request.post({
        url: 'http://localhost:5000/developers/isAuth',
        form: {
            key: user
        }
    }, function(error, response, body){

        if (body == "\"True\""){

            dbHandler.dbactions.selectData(dbcon, 'applications', '*', [['id', req.params.app_id, 0]], 1, function(result){

                if(result.length == 1){
                    
                    dbHandler.dbactions.selectData(dbcon, 'app_repos', '*', [['container_id', result[0]['container_id'], 0]], 1, function(out){
                        
                        if(out.length == 1){

                            request.post({
                                url: config.appsVM + '/repos/project/info',
                                form:{
                                    project_id: out[0]['project_id']
                                }
                            },function(error, response, body){
                                
                                var info = JSON.parse(body);
                                res.json(info);

                            });
                        }
                        else{
                    
                            res.json({message:'Repository not found'});
                        }
                    });
                }
                else{
                    
                    res.json({message:'Application not found'});
                }
            });

        }
        else{
            res.json({message:'authentication failed'});
        }

    });
    
});

module.exports = router;