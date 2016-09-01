var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var shell = require('shelljs');
var request = require('request');

// Create connection
var dbcon = require('../models/dbconnect');

// Access database
var dbHandler = require('../models/dbHandler');



router.get('/config', function(req, res, next) {

    if (req.session.developer) {
        console.log(req.session.developer);
    }

    res.render('developers/configContainer', {

    });
});

router.get('/deploy/:image_id', function(req, res, next) {

    request('http://localhost:5000/developers/isAuth', function(error, response, body){
        
        console.log(body);
        console.log(error);
        res.json(response);
        
    });
    
    //res.json(shell.exec("./scripts/execute_commands.sh 'deploy_container' 'developer_usename' 'ubuntu14.04_python3_node:latest'"));
    
});


router.get('/preconfList', function(req, res, next) {

    dbHandler.dbactions.selectData(dbcon, 'docker_images', '*', [[1, 1, 0]], 1, function(result){
        
        console.log(result);
        res.json(result);
        
    });
    
    
    
});

module.exports = router;