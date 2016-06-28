/*
    This file contains functions used for DB handling procedures
    
*/

var dbactions = {
    
    checkIfExists: function(dbcon, table, username, password, exitCode){
        
        dbcon.dbconnection(function(res){
            
            if(res == 'error'){
                
                return exitCode('error');
            }
            else{
                
                res.query("select * from " + table + " WHERE username='" + username +"'&&email='" + password + "';", function(err, rows){
                
                    if (err){
                        return exitCode('error in query');
                    }
                    else{
                        
                        if (rows.length > 0){
                            return exitCode(true);
                        }
                        else{
                            return exitCode(false);
                        }           
                    }
                });
                
            }
            
            

        });
        
        
    }
    
}



module.exports.dbactions = dbactions;