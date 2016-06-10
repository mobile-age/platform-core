var mysql = require('mysql');
var credentials = require('../db-credentials')

var connection = mysql.createConnection({
    
    host: credentials.host,
    user: credentials.user,
    password: credentials.password,
    database: credentials.db
    
});

connection.connect(function(err){
    
    if(!err){
        console.log("Successful connection to the database");
    }
    else{
        console.log("Connection Failure"); 
        console.log(err);
    }
    
})