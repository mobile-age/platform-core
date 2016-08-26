var express = require('express');
var router = express.Router();
var mysql = require('mysql');

// Create connection
var dbcon = require('../models/dbconnect');

// Access database
var dbHandler = require('../models/dbHandler');

router.get('/signIn', function(req, res, next) {

  res.render('odp/signin', {
  });

});

module.exports = router;
