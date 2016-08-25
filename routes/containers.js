var express = require('express');
var router = express.Router();
var mysql = require('mysql');

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

router.post('/deploy', function(req, res, next) {


    console.log(req.query.code);


    res.render('developers/configContainer', {

    });
});


router.get('/preconfList', function(req, res, next) {

    dbHandler.dbactions.selectData(dbcon, 'docker_images', '*', [[1, 1, 0]], 1, function(result){
        
        console.log(result);
        res.json(result);
        
    });
    
    
    
});

module.exports = router;