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


router.get('/config', function(req, res, next) {

    if (req.session.developer) {
        console.log(req.session.developer);
    }

    res.render('developers/configContainer', {

    });
});

router.get('/deploy/:app_id/:image_tag', function(req, res, next) {

    //var user = req.session.developer;
    var user = 'mobileage';

    request.post({
        url: 'http://localhost:5000/developers/isAuth',
        form: {key: user}

    }, function(error, response, body){

        if (body == "\"True\""){

            request.post({

                url: config.appsVM + '/containers/deploy/' + user + '_' + req.params.app_id + '/' + req.params.image_tag,

            }, function(error, response, body){
                
                var output = JSON.parse(body);
                
                if (output["status"] == "Success"){
                    
                    dbHandler.dbactions.create_rows(dbcon, 'containers', [['container_id', output["containerId"]], ['image_id', req.params.image_tag], ['developer_id', user], ['active', 1]], function(result){
        
                        if(typeof result == 'object'){
                            
                            dbHandler.dbactions.update_table(dbcon, 'applications', [['container_id', output["containerId"]]], [['id', req.params.app_id, 0]], 1, function(result){
        
                                if(typeof result == 'object'){

                                    res.json('success');

                                }
                                else{
                                    res.json('failure');
                                }

                            });

                        }
                        else{
                            res.json('failure');
                        }

                    });
                    
                }
                else{
                    res.json(body);
                }
                
            });

        }
        else{
            res.json('authentication failed');
        }

    });

});


router.get('/preconfList', function(req, res, next) {

    dbHandler.dbactions.selectData(dbcon, 'docker_images', '*', [[1, 1, 0]], 1, function(result){

        res.json(result);

    });
});

router.get('/preconfList/id/:im_id', function(req, res, next) {

    dbHandler.dbactions.selectData(dbcon, 'docker_images', '*', [['image_id', req.params.im_id, 0]], 1, function(result){

        res.json(result);

    });
});


router.get('/:container_id/details', function(req, res, next) {

    var info = {};
    
    dbHandler.dbactions.selectData(dbcon, 'containers', '*', [['container_id', req.params.container_id, 0]], 1, function(result){
        
        info["id"] = result[0]["container_id"];
        if (result[0]["active"] > 0){
            info["active"] = "running";
        }
        else{
            info["active"] = "stopped";
        }
        info["image"] = result[0]["image_id"];
        
        res.json(info);

    });
});

/*
router.get('/test', function(req, res, next) {

    var x = '{"status":"Success","containerId":"6f4b563d3e42ec1de025a5f966fdb5472f5549b6ebb1fe42582e41446dbe1d4f"}'
    
    var y = JSON.parse(x);
    
    if (x["status"] == "Success"){
        res.json('YESS');
        
    }
    else{
        res.json(y["status"]);
    }
    
});
*/


module.exports = router;
