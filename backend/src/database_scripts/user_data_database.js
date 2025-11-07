import {addNewItem,getOne,getAll,dropCollection,deleteByQuery,updateItem} from './generic_database.js'

async function addUserData(db_connection,name){
    const user_data_item={username:name,
                    seen:[],sightings:[]}
    const result=await addNewItem(db_connection,"UserData",user_data_item);
    return result;
}

async function getUserDataByName(db_connection,name){
    const result=await getOne(db_connection,"UserData",{username:name});
    if(result instanceof Error){
        return result;
    }else{
        return result;
    }
}

async function getAllUserData(db_connection){
    const result=await getAll(db_connection,"UserData");
    return result;
}

async function updateUserData(db_connection,name,userInfo){
    const result=await updateItem(db_connection,"UserData",{username:name},userInfo);
    return result;
}


async function deleteSpeciesLinkDescription(db_connection,name){
    const query={username:name}
    const result=await deleteByQuery(db_connection,"UserData",query)
    return result;
}

async function associateUserWithStripeCustomerID(db_connection,username,customerID){
    const query={username:username}
    const result=await updateItem(db_connection,"UserData",query,{stripe_customer_id:customerID})
    return result;
}

export {addUserData,getUserDataByName,getAllUserData,updateUserData,deleteSpeciesLinkDescription,associateUserWithStripeCustomerID}
