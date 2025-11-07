import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import path from 'path';
import fs from 'fs';
import UserModel from './UserModel.js'

let connected_to_mongoose=false;
const JWT_SECRET=process.env.JWT_SECRET

const createJsonWebToken=(user)=>{
    const token=jwt.sign({id:user._id,username:user.username,authentication_level:user.auth_level},JWT_SECRET,{expiresIn:'1d'})
    return token;
}

const checkTokenValidity=(token,minimum_auth_level)=>{
    const ordered_auth_levels=["user","admin"]
    try{
        const user_token_object=jwt.verify(token,JWT_SECRET)
        const auth_level=user_token_object.authentication_level;
        if(ordered_auth_levels.indexOf(auth_level)>=ordered_auth_levels.indexOf(minimum_auth_level)){
            return true;
        }else{
            return false;
        }
    }catch(error){
        console.log("Warning: Authentication failed with message "+error+", the request has been denied");
        return false;
    }
}

const getUsernameFromToken=(token)=>{
    return jwt.verify(token,JWT_SECRET).username;
}

const checkTokenBelongsToUser=(token,proposed_username)=>{
    if(getUsernameFromToken(token)===proposed_username){
        return true;
    }else{
        return false;
    }
}

const connectToMongoose=async (uri)=>{
    if(!connected_to_mongoose){
        try{
            await mongoose.connect(uri)
            connected_to_mongoose=true;
        }catch(error){
            console.log("Failed to connect to mongoose, Error: "+error+". Trying again ...")
            setTimeout(()=>connectToMongoose(uri),5000)
        }
    }else{
        console.log("Warning: Failed attempt to connect to mongoose - Already Connected");
    }
}

const createNewUserDirectory=(username)=>{
    const __dirname=import.meta.dirname
    let directory_path=path.join(__dirname,'..','..','static','user',username,"images")
    
    fs.mkdir(directory_path,{recursive:true},(error)=>{
        if(error){
            return {"success":false}
        }else{
            return {"success":"true"}
        }
    }) 
}

const addUser=async(username,email,password,auth_level)=>{
    if(connected_to_mongoose){
        try{
            const hashed_password=null;
            if(password!==null){
                hashed_password=await bcrypt.hash(password,10);
            }
            const user= new UserModel({username,email,password: hashed_password,auth_level:auth_level})
            await user.save();
            await createNewUserDirectory(username)
            const token=createJsonWebToken(user)
            return {"acknowledged":true,"jwt_token":token}

        }catch(error){
            console.log("Failed to add user, Error: "+error)
            return null;
        }
    }else{
        console.log("Warning: Operation add user failed - Not connected to Mongoose")
    }
}

const getUser=async(username)=>{
    if(connected_to_mongoose){
        try{
            const result=await UserModel.findOne({username:username})
            return result;
        }catch(error){
            console.log("Failed to get user, Error: "+error)
        }
    }else{
        console.log("Warning: Operation get user failed - Not connected to Mongoose")
    }
}

const verifyUser=async(username,password)=>{
    if(connected_to_mongoose){
        try{
            const user=await getUser(username)
            if(!user){
                return false;
            }
            const is_match=await bcrypt.compare(password,user.password)
            return is_match;
        }catch(error){
            console.log("Failed to verify user, Error: "+error)
        }
    }else{
        console.log("Warning: Operation verify user failed - Not connected to Mongoose")
    }
}

const deleteUser=async(username)=>{
    if(connected_to_mongoose){
        try{
            const user=await getUser(username)
            await UserModel.findByIdAndDelete(user._id)
        }catch(error){
            console.log("Failed to delete user, Error: "+error)
        }
    }else{
        console.log("Warning: Operation delete user failed - Not connected to Mongoose")
    }
}

export {createJsonWebToken,checkTokenValidity,connectToMongoose,addUser,getUser,verifyUser,deleteUser,checkTokenBelongsToUser,getUsernameFromToken}
