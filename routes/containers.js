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

router.get('/deploy/:image_tag', function(req, res, next) {
    
    //var user = req.session.developer;
    var user = 'mobileage';
    
    request.post({
        url: 'http://localhost:5000/developers/isAuth',
        form: {key: user}
        
    }, function(error, response, body){
        
        if (body == "\"True\""){
            
            request.post({
                
                url: config.appsVM + '/containers/deploy/' + user + '/' + req.params.image_tag,
                
            }, function(error, response, body){
                
                res.json(body);
                
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



module.exports = router;