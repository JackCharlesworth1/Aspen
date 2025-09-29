import {connectToMongoose,addUser} from '../src/database_scripts/user_database.js'

const addAdmin=async ()=>{
    const admin_username=process.env.ADMIN_USERNAME;
    const admin_email=process.env.ADMIN_EMAIL;
    const admin_password=process.env.ADMIN_PASSWORD;
    if(admin_username&&admin_email&&admin_password){
        const result=await addUser(admin_username,admin_email,admin_password,"admin");
        if(!result){
            console.log("Warning, failed to add admin user, something went wrong adding the user to database")
        }else{
            console.log("Added admin successfully")
        }
    }else{
        console.log("Cannot add admin, missing username/email/password, add them in the .env file. Tried to add",admin_username,admin_email,admin_password)
    }
}
const main=async ()=>{
    if(process.env.DATABASE_ENDPOINT_URI){
        await connectToMongoose("mongodb://"+process.env.DATABASE_ENDPOINT_URI);
        await addAdmin();
    }else{
        console.log("NEED TO SET DATABASE ENDPOINT")
    }
}

main();
