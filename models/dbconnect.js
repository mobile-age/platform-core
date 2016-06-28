/*
    This file contains information regarding DB connection process
    
*/

var mysql = require('mysql');
var credentials = require('../db-credentials')


// Function for creating connection
function mysqlCon(connection){
    
    var con = mysql.createConnection({
    
        host: credentials.host,
        user: credentials.user,
        password: credentials.password,
        database: credentials.db

    });
    
    con.connect(function(err){
    
        if(!err){
            console.log('Connection Successful');
            return connection(con);
        }
        else{
            console.log('Ooops, something went wrong');
            console.log(err);
            
            return connection("error");
        }
        
    });
    
}

module.exports.dbconnection = mysqlCon;