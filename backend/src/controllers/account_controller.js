import {checkTokenBelongsToUser} from '../database_scripts/user_database.js'
import {getUserDataByName} from '../database_scripts/user_data_database.js'
import {getDBConnection} from '../database_scripts/species_database.js'

const db_connection=await getDBConnection();

const getAccountInfoHandler=(req,res)=>{
    if(!checkTokenBelongsToUser(req.header('Authorization'),req.params.username)){
        res=writeUserReturnResponse(res,{"Error":"The username associated with the JWT token does not match that which you are trying to access - "+req.params.username})
    }else{
        const result=getUserDataByName(db_connection,req.params.username) 
        console.log("Returning results to user:",result);
        res=writeUserReturnResponse(res,result)
    }
    res.end()
}

function writeUserReturnResponse(response,result){
    if(result instanceof Error){
        response.status(500).json({"Error":result});
    }else if(!result){
        response.status(404).json({"Error":"User database has no response"})
    }else{
        response.status(200).json(result);
    }
    return response;
}


export {getAccountInfoHandler}
