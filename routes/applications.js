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
        form: {key: user}

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



module.exports = router;