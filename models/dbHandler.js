/*
    This file contains functions used for DB handling procedures
    
*/

var dbactions = {
    
    checkIfExists: function(dbcon, table, username, password, exitCode){
        
        dbcon.dbconnection(function(res){
            
            if(res == 'error'){
                
                return exitCode('error_01');
            }
            else{
                
                res.query("select * from " + table + " WHERE username='" + username +"'&&password='" + password + "';", function(err, rows){
                
                    if (err){
                        return exitCode('error_02');
                    }
                    else{
                        
                        if (rows.length > 0){
                            return exitCode(rows);
                        }
                        else{
                            return exitCode(false);
                        }           
                    }
                });
                
            }
        });    
    },
    selectData: function(dbcon, table, columnNames, condition, oper, exitCode){
        
        // This function is responsible for retrieving data from a MySQL database
        
        var errCode = "01f";
        
        dbcon.dbconnection(function(res){
            
            if(res == 'error'){
                
                return exitCode(errCode + '_error_01');
            }
            else{
                
                var argument = "";
                
                for(var i=0;i<condition.length;i++){
                    
                    switch(condition[i][2]){
                            
                        case 0:
                            argument = argument + condition[i][0] + "='" + condition[i][1] + "'";
                            break;
                        case 1:   
                            argument = argument + condition[i][0] + ">'" + condition[i][1] + "'";
                            break;
                        case 2:   
                            argument = argument + condition[i][0] + "<'" + condition[i][1] + "'";
                            break;
                        case 3:   
                            argument = argument + condition[i][0] + ">='" + condition[i][1] + "'";
                            break;
                        case 4:   
                            argument = argument + condition[i][0] + "<='" + condition[i][1] + "'";
                            break;
                        default:
                            return exitCode(errCode + '_error_02'); //Λάθος condition value       
                    }
                    if (i < ((condition.length) - 1)){

                        switch(oper){
                            
                            case 0:
                                argument = argument + ' && ';
                                break;
                            case 1:
                                argument = argument + ' || ';
                                break;
                            default:
                                return exitCode(errCode + '_error_03'); //Λάθος operand value     
                        }
                        
                    }   
                }
                if (columnNames == '*'){
                    
                    res.query("SELECT * FROM " + table + " WHERE " + argument + ";", function(err, rows){
                
                        if (err){
                            return exitCode(errCode + '_error_04');
                        }
                        else{
                            return exitCode(rows);          
                        }
                    });
                    
                }
                else{
                    
                    var selCols = "";
                    for (var i=0; i<(columnNames.length - 1); i++){
                        
                        selCols = selCols + "" + columnNames[i] + ", ";
                    }
                    
                    selCols = selCols + "" + columnNames[columnNames.length - 1] + " ";
                    
                    res.query("SELECT " + selCols + " FROM " + table + " WHERE " + argument + ";", function(err, rows){
                
                        if (err){
                            return exitCode(errCode + '_error_05');
                        }
                        else{
                            return exitCode(rows);          
                        }
                    });
                    
                }
            }
        });
    },
    update_table: function(dbcon, table, columnNames, condition, oper, exitCode){
    
        var errCode = "02f";
        
        dbcon.dbconnection(function(res){
            
            if(res == 'error'){
                
                return exitCode(errCode + '_error_01');
            }
            else{
                
                var argument_1 = "";
                
                for(var i=0; i<(columnNames.length - 1); i++){
                    
                    argument_1 = argument_1 + columnNames[i][0] + "='" + columnNames[i][1] + "',";
                    
                }
                argument_1 = argument_1 + columnNames[columnNames.length - 1][0] + "='" + columnNames[columnNames.length - 1][1] + "'";
                
                var argument_2 = "";
                
                for (i=0; i<condition.length; i++){
                    
                    switch(condition[i][2]){
                            
                        case 0:
                            argument_2 = argument_2 + condition[i][0] + "='" + condition[i][1] + "'";
                            break;
                        case 1:
                            argument_2 = argument_2 + condition[i][0] + ">'" + condition[i][1] + "'";
                            break;
                        case 2:
                            argument_2 = argument_2 + condition[i][0] + "<'" + condition[i][1] + "'";
                            break;
                        case 3:
                            argument_2 = argument_2 + condition[i][0] + ">='" + condition[i][1] + "'";
                            break;
                        case 4:
                            argument_2 = argument_2 + condition[i][0] + "<='" + condition[i][1] + "'";
                            break;
                        default:
                            return exitCode(errCode + '_error_02'); //Λάθος condition value
                    }
                    if(i<(condition.length - 1)){
                        
                        switch(oper){
                                
                            case 0:
                                argument_2 = argument_2 + " && ";
                                break;
                            case 1:
                                argument_2 = argument_2 + " || ";
                                break;    
                            default:
                                return exitCode(errCode + '_error_03'); //Λάθος operand value
                        }
                    }
                }
                
                res.query("UPDATE " + table + " SET " + argument_1 + " WHERE " + argument_2 + ";", function(err, rows){
                
                    if (err){
                        return exitCode(errCode + '_error_04');
                    }
                    else{
                        return exitCode(rows);          
                    }
                });
                
            }
        });
    }
}



module.exports.dbactions = dbactions;