import {checkTokenValidity} from '../database_scripts/user_database.js'

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
export {verifyUserAuthenticationHeader,verifyAdminAuthenticationHeader}
