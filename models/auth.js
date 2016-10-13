var auth = {
    
    devIsAuth: function(dbcon, dbHandler, username, exitCode){
        
        var send = {};
    
        dbHandler.dbactions.selectData(dbcon, 'developers', '*', [['username', username, 0]], 1, function(result){

            if(result['queryStatus'] == 'Success'){

                if(result['data'].length > 0){
                    send["queryStatus"] = "Success";
                    send["isAuth"] = "true";
                }
                else{
                    send["queryStatus"] = "Success";
                    send["isAuth"] = "false"; 
                }

            }
            else{
                send["queryStatus"] = "Failure";
                send["queryMessage"] = "BD Query error";
            }
            
            return exitCode(send);
        });  
    } 
}

module.exports.auth = auth;