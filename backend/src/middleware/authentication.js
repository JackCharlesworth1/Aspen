import {checkTokenValidity,getUsernameFromToken} from '../database_scripts/user_database.js'
import {getUserDataByName} from '../database_scripts/user_data_database.js'
import {getDBConnection} from '../database_scripts/species_database.js'

const db_connection=getDBConnection();

const verifyAuthenticationHeader=(req,res,next,minimum_auth_level)=>{
    const token=req.header('Authorization')
    if(token){
        if(checkTokenValidity(token,minimum_auth_level)){
            next();
        }else{
            return res.status(401).json({message: 'Invalid or expired token'})
        }
    }else{
        return res.status(403).json({message: 'Missing token'})
    }
       
}

const verifyUserAuthenticationHeader=(req,res,next)=>{
    return verifyAuthenticationHeader(req,res,next,"user");
}

const verifyAdminAuthenticationHeader=(req,res,next)=>{
    return verifyAuthenticationHeader(req,res,next,"admin");
}

const verifyUserSubscribed=async (req,res,next)=>{
    if(req.header("Authorization")){
        const username=getUsernameFromToken(req.header("Authorization"))
        const user_data=await getUserDataByName(db_connection,username) 
        if(user_data.subscribed){
            next()
        }else{
            return res.status(403).json({message:'You must be subscribed to use this route'})
        }
    }else{
        return res.status(401).json({message:'Invalid or expired token'})
    }
}

export {verifyUserAuthenticationHeader,verifyAdminAuthenticationHeader,verifyUserSubscribed}
