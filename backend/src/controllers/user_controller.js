import {createJsonWebToken,connectToMongoose,addUser,getUser,verifyUser,deleteUser} from '../database_scripts/user_database.js'
import {getDBConnection} from '../database_scripts/species_database.js'
import {addUserData,getUserDataByName,updateUserData} from '../database_scripts/user_data_database.js'
import {addSightingToUser} from '../static_scripts/static_upload.js'
import { OAuth2Client } from 'google-auth-library';
import path from 'path';
import fs from 'fs';

const database_endpoint_uri=process.env.DATABASE_ENDPOINT_URI
await connectToMongoose("mongodb://"+database_endpoint_uri)
const db_connection=await getDBConnection()

const GOOGLE_OAUTH_CLIENT=new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registrationHandler=async(req,res)=>{
    if(req.body.username&&req.body.email&&req.body.password){
        if(!req.username.match(/[^0-9a-z]/i)){
            if(req.body.email.includes("@")&&req.body.email.includes(".")){
                const result=await addUser(req.body.username,req.body.email,req.body.password,"user")
                //If we returned anything, it is an error
                if(result){
                    if(result.acknowledged){
                        const data_result=await addUserData(db_connection,req.body.username) 
                        res=writeUserReturnResponse(res,{"success":true,"token":result.jwt_token});
                    }
                }else{
                    res=writeUserReturnResponse(res,"Either username or email is already in use")
                }
            }else{
                const invalid_email_message="Invalid email address provided, use a real one"
                res=writeUserReturnResponse(res,invalid_email_message)
            }
        res.end()
        }else{
            console.log("Invalid username, stick to alphanumeric characters")
        }
    }else{
        console.log("Warning, registration not fufilled - Missing parameter/s");
    }
}

const loginHandler=async(req,res)=>{
    if(req.body.username&&req.body.password){
        let result=await verifyUser(req.body.username,req.body.password)
        if(result){
            const user=await getUser(req.body.username)
            const token=createJsonWebToken(user);
            result={"acknowledged":true,"token":token,"role":user.auth_level};
        }else{
            result="Incorrect username or password, please try again"
        }
        res=writeUserReturnResponse(res,result);
        res.end()
    }else{
        console.log("Warning, login not fufilled - Missing parameter/s")
    }
}

const getIfUserSeenSpeciesHandler=async (req,res)=>{
    if(req.params.name&&req.params.species){
        const user_data=await getUserDataByName(db_connection,req.params.name);
        if(user_data){
            let result="";
            if(user_data.seen.includes(req.params.species)){
                result={"species_seen":true}
            }else{
                result={"species_seen":false}
            }
            res=writeUserReturnResponse(res,result);
        }else{
            res=writeUserReturnResponse(res,"No user found for that name")
        }
    }else{
        res=writeUserReturnResponse(res,"Request has missing parameters")
    }
    res.end()
}

const setIfUserSeenSpeciesHandler=async (req,res)=>{
    console.log("MISSING REQ POTENTIAL",req.body)
    if(req.body.name&&req.body.species&&req.body.seen!==undefined){
        const user_data=await getUserDataByName(db_connection,req.body.name);
        console.log("user_data",user_data)
        if(user_data){
            const seen_list_copy=[...user_data.seen]
            let result="";
            if(seen_list_copy.includes(req.body.species)&&(!req.body.seen)){
                const index_to_remove=seen_list_copy.indexOf(req.body.species)
                seen_list_copy.splice(index_to_remove,1)
                result={"success":true}
            }else if((!seen_list_copy.includes(req.body.species))&&req.body.seen){
                seen_list_copy.push(req.body.species)
                result={"success":true}
            }else{
                result={"success":false}
            }
            updateUserData(db_connection,req.body.name,{seen:seen_list_copy})
            console.log("RETURNING",res)
            res=writeUserReturnResponse(res,result);
        }else{
            res=writeUserReturnResponse(res,"No user found for that name")
        }
    }else{
        res=writeUserReturnResponse(res,"Request has missing parameters")
    }
    res.end()
}

const getNumberOfSightingImages=async (req,res)=>{
   console.log("PARAMS",req.params)
   if(req.params.username&&req.params.species){
        const user_data=await getUserDataByName(db_connection,req.params.username);
        console.log("user_data",user_data)
        if(user_data){
           if(user_data.sightings){
                const numberOfSightings=user_data.sightings.filter(item=>item===req.params.species).length;
                res=writeUserReturnResponse(res,{"sightings":numberOfSightings})
           }else{
                res=writeUserReturnResponse(res,{"sightings":0})
           } 

        }else{
            res=writeUserReturnResponse(res,"Username supplied in request "+req.params.uesrname+" has no associated user data")
        }

   }else{
        res=writeUserReturnResponse(res,"Request has missing parameters")
   } 
   res.end()
}

const getUserSubmittedSightings=async (req,res)=>{
    if(req.params.username&&req.params.species&&req.params.number){

   }else{
        res=writeUserReturnResponse(res,"Request has missing parameters")
   } 
   res.end()

}

const addUserSubmittedSightings=async (req,res)=>{
    if(req.params.username&&req.params.species_name&&req.body){
        //const number=await getNumberOfSightingImages(req,res);
        const user_data=await getUserDataByName(db_connection,req.params.username);
        console.log("data",user_data)
        console.log("SIGHTINGS",user_data.sightings)
        if(user_data.sightings){
            const numberOfSightings=user_data.sightings.filter(item=>item===req.params.species_name).length;
            console.log(user_data.sightings,numberOfSightings)
            if(numberOfSightings==0){
                createNewUserSightingDirectory(req.params.username,req.params.species_name)
            }
            const sightings_copy=[...user_data.sightings]
            console.log("SIGHTINGS COPYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",sightings_copy)
            sightings_copy.push(req.params.species_name)
            console.log("SIGHTINGS UPDATEDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",sightings_copy)
            const update_result=await updateUserData(db_connection,req.params.username,{sightings:sightings_copy})
            console.log("UPDATE RESULT",update_result)
            const result=await addSightingToUser(req,res,req.params.username,req.params.species_name,numberOfSightings,req.body);
            if(result instanceof Error){
                console.log("Warning, error when uploading user ",req.body.username,"sighting of",req.body.species_name,": ",result)
                res=writeUserReturnResponse(res,{"success":false})
            }else{
                res=writeUserReturnResponse(res,{"success":true})
            }
        }
    }else{
        console.log("Warning, insufficient parameters supplied when adding image to sightings",req.params,req.body)
        res=writeUserReturnResponse(res,{"success":false})
    }
}

const googleOAuthTokenGenerationHandler=async(req,res)=>{
   const auth_credential=req.body;
   console.log("-------------------------------------Google Auth Credential Attempt",auth_credential.token,typeof auth_credential.token)
   try{
        const ticket=await GOOGLE_OAUTH_CLIENT.verifyIdToken({
            idToken:auth_credential.token,
            audience:process.env.GOOGLE_CLIENT_ID,
        })
        const payload=ticket.getPayload();
        const {googleID,email,name}=payload;

        const email_split=email.split("@")
        const assumed_username="<GOOGLE_USER>"+email_split[0];

        const user_query_response=await getUser(assumed_username)

        if(user_query_response){
            const token=createJsonWebToken(user_query_response);
            const result={"acknowledged":true,"token":token,"role":user_query_response.auth_level,"username":assumed_username};
            res=writeUserReturnResponse(res,result);

        }else{
            const result=await addUser(assumed_username,email,null,"user")
            if(result){
                if(result.acknowledged){
                    const data_result=await addUserData(db_connection,assumed_username) 
                    res=writeUserReturnResponse(res,{"success":true,"token":result.jwt_token,"role":"user","username":assumed_username});
                }
            }else{
                res=writeUserReturnResponse(res,"Either username or email is already in use")
            }
        }

   }catch(error){
        console.log("Error when issuing JWT token for a user logging in with google",error)
   }
   res.end();
}

const createNewUserSightingDirectory=(username,species_name)=>{
    const __dirname=import.meta.dirname
    let directory_path=path.join(__dirname,'..','..','static','user',username.replace(" ","_").toLowerCase(),"images",species_name.replace(" ","_").toLowerCase())
    
    fs.mkdir(directory_path,{recursive:true},(error)=>{
        if(error){
            return {"success":false}
        }else{
            return {"success":"true"}
        }
    }) 
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



export {registrationHandler,loginHandler,getIfUserSeenSpeciesHandler,setIfUserSeenSpeciesHandler,addUserSubmittedSightings,getNumberOfSightingImages,googleOAuthTokenGenerationHandler}
