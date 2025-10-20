import {MongoClient} from "mongodb"
import fs from 'fs'
import path from 'path'

function hasCharactersUsedInInjection(object){
    for(const key in object){
        if(key.includes("$")||key.includes(".")){
            return true;
        }
        if(typeof object[key]==="object"&&object[key]!==null&&(!Array.isArray(object[key]))){
            if(hasCharactersUsedInInjection(object[key])){
                return true;
            }
        }
    }
    return false;
}

async function connectToMongo(db_endpoint_uri){
    const client=new MongoClient("mongodb://"+db_endpoint_uri)
    console.log("Created MongoDB client with ",db_endpoint_uri)
    try{
        await client.connect();
    }catch(error){
        console.log(error)
    }
    const db=client.db("Aspen");
    return db;
}

async function addNewItem(db_connection,collection_name,item){
    if(!db_connection||!collection_name||!item){
        return new Error(`Error adding new item: A parameter is missing, null or undefined. Parameters supplied ${db_connection}, ${collection_name}, ${item}`)
    }
    if(db_connection.constructor.name!=="Db"){
        return new Error(`Error adding new item: Database connection is the wrong type (${db_connection.constructor.name}), should be a Db object`)
    }
    if(typeof collection_name!=="string"){
        return new Error(`Error adding new item: Collection name is the wrong type (${typeof collection_name}), should be a string`)
    }
    if(item.constructor.name!=="Object"){
        return new Error(`Error adding new item: Query is the wrong type (${item.constructor.name}), should be a json`)
    }
    if(hasCharactersUsedInInjection(item)){
        return new Error(`Error adding new item: Item (${item}) contains characters that are blocked to prevent mongo db injection ($ and .), please refrain from using them`)
    }
    let collection=await db_connection.collection(collection_name);
    let result=await collection.insertOne(item);
    return result;
}

async function getOne(db_connection,collection_name,query){
    if(!db_connection||!collection_name||!query){
        return new Error(`Error getting item: A parameter is missing, null or undefined. Parameters supplied ${db_connection}, ${collection_name}, ${query}`)
    }
    if(db_connection.constructor.name!=="Db"){
        return new Error(`Error getting item: Database connection is the wrong type (${db_connection.constructor.name}), should be a Db object`)
    }
    if(typeof collection_name!=="string"){
        return new Error(`Error getting item: Collection name is the wrong type (${typeof collection_name}), should be a string`)
    }
    if(query.constructor.name!=="Object"){
        return new Error(`Error getting item: Query is the wrong type (${query.constructor.name}), should be a json`)
    }
    if(hasCharactersUsedInInjection(query)){
        return new Error(`Error getting item: Query (${query}) contains characters that are blocked to prevent mongo db injection ($ and .), please refrain from using them`)
    }
    let collection=await db_connection.collection(collection_name);
    let results=await collection.findOne(query)
    return results;

}

async function getAll(db_connection,collection_name){
    if(!db_connection||!collection_name){
        return new Error(`Error getting all items: A parameter is missing, null or undefined. Parameters supplied ${db_connection}, ${collection_name}`)
    }
    if(db_connection.constructor.name!=="Db"){
        return new Error(`Error getting all items: Database connection is the wrong type (${db_connection.constructor.name}), should be a Db object`)
    }
    if(typeof collection_name!=="string"){
        return new Error(`Error getting all items: Collection name is the wrong type (${typeof collection_name}), should be a string`)
    }

    let collection=await db_connection.collection(collection_name);
    let results=await collection.find({}).toArray();
    return results;
}

async function getAllOfOneField(db_connection,collection_name,property_name){
    if(!db_connection||!collection_name){
        return new Error(`Error getting all items of one field: A parameter is missing, null or undefined. Parameters supplied ${db_connection}, ${collection_name}`)
    }
    if(db_connection.constructor.name!=="Db"){
        return new Error(`Error getting all items of one field: Database connection is the wrong type (${db_connection.constructor.name}), should be a Db object`)
    }
    if(typeof collection_name!=="string"){
        return new Error(`Error getting all items of one field: Collection name is the wrong type (${typeof collection_name}), should be a string`)
    }

    let collection=await db_connection.collection(collection_name);
    let results=await collection.find({[property_name]:{$exists:true}},{projection:{[property_name]:true,_id:0}}).toArray();
    if(!(results instanceof Error)){
        let final_results=[];
        for(let i=0;i<results.length;i++){
            final_results.push(results[i][property_name])
        }
        final_results=final_results.flat(2)
        return final_results;
    }
    return results;
}

async function dropCollection(db_connection,collection_name){
    if(!db_connection||!collection_name){
        return new Error(`Error dropping collection: A parameter is missing, null or undefined. Parameters supplied ${db_connection}, ${collection_name}`)
    }
    if(db_connection.constructor.name!=="Db"){
        return new Error(`Error dropping collection: Database connection is the wrong type (${db_connection.constructor.name}), should be a Db object`)
    }
    if(typeof collection_name!=="string"){
        return new Error(`Error dropping collection: Collection name is the wrong type (${typeof collection_name}), should be a string`)
    }
    let collection=await db_connection.collection(collection_name);
    let result=await collection.drop();
    let new_collection=await db_connection.collection(collection_name);
    return result;
}

async function deleteByQuery(db_connection,collection_name,query){
    if(!db_connection||!collection_name||!query){
        return new Error(`Error deleting item: A parameter is missing, null or undefined. Parameters supplied ${db_connection}, ${collection_name}, ${query}`)
    }
    if(db_connection.constructor.name!=="Db"){
        return new Error(`Error deleting item: Database connection is the wrong type (${db_connection.constructor.name}), should be a Db object`)
    }
    if(typeof collection_name!=="string"){
        return new Error(`Error deleting item: Collection name is the wrong type (${typeof collection_name}), should be a string`)
    }
    if(query.constructor.name!=="Object"){
        return new Error(`Error deleting item: Query is the wrong type (${query.constructor.name}), should be a json`)
    }
    if(hasCharactersUsedInInjection(query)){
        return new Error(`Error deleting item: Query (${query}) contains characters that are blocked to prevent mongo db injection ($ and .), please refrain from using them`)
    }
    let collection=await db_connection.collection(collection_name);
    let result= await collection.deleteOne(query);
    return result;
}

async function updateItem(db_connection,collection_name,query,new_item){
    if(!db_connection||!collection_name||!query||!new_item){
        return new Error(`Error updating item: A parameter is missing, null or undefined. Parameters supplied ${db_connection}, ${collection_name}, ${query}, ${new_item}`)
    }
    if(db_connection.constructor.name!=="Db"){
        return new Error(`Error updating item: Database connection is the wrong type (${db_connection.constructor.name}), should be a Db object`)
    }
    if(typeof collection_name!=="string"){
        return new Error(`Error updating item: Collection name is the wrong type (${typeof collection_name}), should be a string`)
    }
    if(query.constructor.name!=="Object"){
        return new Error(`Error updating item: Query is the wrong type (${query.constructor.name}), should be a json`)
    }
    if(new_item.constructor.name!=="Object"){
        return new Error(`Error updating item: New item is the wrong type (${new_item.constructor.name}), should be a json`)
    }
    if(hasCharactersUsedInInjection(new_item)){
        return new Error(`Error updating item: Query (${query}) contains characters that are blocked to prevent mongo db injection ($ and .), please refrain from using them`)
    }
    let old_item=await getOne(db_connection,collection_name,query);
    const new_item_keys=Object.keys(new_item);
    //For each attribute of new_item, overwrite old item
    //But items not addressed by new item will be maintained
    for(let i=0;i<new_item_keys.length;i++){
        old_item[new_item_keys[i]]=new_item[new_item_keys[i]];
    }
    const deletion_result=await deleteByQuery(db_connection,collection_name,query);
    const insertion_result=await addNewItem(db_connection,collection_name,old_item);
    if((deletion_result.acknowledged)&&(insertion_result.acknowledged)){
        return insertion_result;
    }else{
        let error_message="Error updating species: ";
        if(!deletion_result.acknowledged){
            error_message+="Deleting the old copy of the species failed";
        }
        if(!insertion_result.acknowledged){
            error_message+="Inserting the reformed species back into the database failed. "
        }
        return new Error(error_message);
    }
}

export {connectToMongo,addNewItem,getOne,getAll,dropCollection,deleteByQuery,updateItem,getAllOfOneField}

