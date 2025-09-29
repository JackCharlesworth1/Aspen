import express from 'express'
import {getDBConnection,clearSpeciesCollection,addNewSpecies,deleteSpeciesByName,getEntryByName,getAllEntries,updateSpeciesByName,addLinksToCorrespondingSpecies,getAllDistinctTags} from '../database_scripts/species_database.js'
import {addNewSpeciesLink,getSpeciesLinkDescription,updateSpeciesLinkDescription,deleteSpeciesLinkDescription,getAllSpeciesLinkDescriptions,getSpeciesLinkType} from '../database_scripts/species_links_database.js'
import {getSpeciesInfoByCommonName,getMapDataForSpecies} from '../external/map_api_query.js'
import {addImageToSpecies,addAudioToSpecies} from '../static_scripts/static_upload.js'

const db_connection=await getDBConnection()

const getAllEntriesHandler=async(req,res)=>{
    res.setHeader('Content-Type','application/json');
    let all_species=await getAllEntries(db_connection);
    res=writeReturnResponse(res,all_species)
    res.end();
}

const getSpecificEntryHandler=async(req,res)=>{
    res.setHeader('Content-Type','application/json');
    let species=await getEntryByName(db_connection,req.params.name);
    res=writeReturnResponse(res,species);
    res.end();
}

const getAllDistinctTagsHandler=async(req,res)=>{
    res.setHeader('Content-Type','application/json');
    const tags=await getAllDistinctTags(db_connection) 
    res=writeReturnResponse(res,tags)
    res.end()
}

const addNewSpeciesHandler=async(req,res)=>{
    res.setHeader('Content-Type','application/json');
    let species_api_data=await getSpeciesInfoByCommonName(req.body.SpeciesName);
    let species_data;
    if(species_api_data!==null){
        species_data=Object.assign(req.body,species_api_data)
        await getMapDataForSpecies(species_data.TaxonKey,req.body.SpeciesName);
    }else{
        species_data=req.body;
    }
    let result=await addNewSpecies(db_connection,species_data);
    await addLinksToCorrespondingSpecies(db_connection,[],req.body);
    res=writeReturnResponse(res,result);
    res.end();
}

const updateSpeciesHandler=async (req,res)=>{
    res.setHeader('Content-Type','application/json');
    let result=await updateSpeciesByName(db_connection,req.params.name,req.body);
    res=writeReturnResponse(res,result);
    res.end()
}

const deleteSpeciesHandler=async (req,res)=>{
    res.setHeader('Content-Type','application/json');
    let result=await deleteSpeciesByName(db_connection,req.params.name)
    res=writeReturnResponse(res,result);
    res.end()
}

const clearAllSpeciesHandler=async (req,res)=>{
    res.setHeader('Content-Type','application/json');
    let response=clearSpeciesCollection(db_connection)    
    res=writeReturnResponse(res,result);
    res.end();
}

const addImageToSpeciesHandler=async (req,res)=>{
    res.setHeader('Content-Type','application/json');
    let result=await addImageToSpecies(req,res,req.params.name,req.body);
    res=writeReturnResponse(res,result)
    res.end()
}

const addAudioToSpeciesHandler=async (req,res)=>{
    res.setHeader('Content-Type','application/json')
    let result=await addAudioToSpecies(req,res,req.params.name,req.body);
    res=writeReturnResponse(res,result)
    res.end()
}

const addSpeciesLinkHandler=async (req,res)=>{
    res.setHeader('Content-Type','application/json')
    const result=await addNewSpeciesLink(db_connection,req.body.SpeciesOne,req.body.SpeciesTwo,req.body.LinkDescription,req.body.LinkType)
    res=writeReturnResponse(res,result);
    res.end()
}

const getSpeciesLinkHandler=async (req,res)=>{
    res.setHeader('Content-Type','application/json')
    const description_result=await getSpeciesLinkDescription(db_connection,req.params.SpeciesOne,req.params.SpeciesTwo)
    const type_result=await getSpeciesLinkType(db_connection,req.params.SpeciesOne,req.params.SpeciesTwo)
    const link_object={description:description_result,type:type_result}
    res=writeReturnResponse(res,link_object);
    res.end()

}

const updateSpeciesLinkHandler=async (req,res)=>{
    res.setHeader('Content-Type','application/json')
    let result=null;
    const previous_record_of_link=await getSpeciesLinkDescription(db_connection,req.params.SpeciesOne,req.params.SpeciesTwo)
    if(previous_record_of_link&&(!(previous_record_of_link instanceof Error))){
        result=await updateSpeciesLinkDescription(db_connection,req.params.SpeciesOne,req.params.SpeciesTwo,req.body.LinkDescription,req.body.LinkType)
    }else{
        result=await addNewSpeciesLink(db_connection,req.params.SpeciesOne,req.params.SpeciesTwo,req.body.LinkDescription,req.body.LinkType)
    }
    res=writeReturnResponse(res,result)
    res.end()
}

const deleteSpeciesLinkHandler=async (req,res)=>{
    res.setHeader('Content-Type','application/json')
    const result=await deleteSpeciesLinkDescription(db_connection,req.params.SpeciesOne,req.params.SpeciesTwo)
    res=writeReturnResponse(res,result)
    res.end()

}

const getAllSpeciesLinksHandler=async (req,res)=>{
    res.setHeader('Content-Type','application/json');
    const result=await getAllSpeciesLinkDescriptions(db_connection);
    res=writeReturnResponse(res,result)
    res.end()
}

function writeReturnResponse(response,result){
    if(typeof result==="Error"){
        response.status(500).json({"Error":result})
    }else if(!result){
        response.status(404).json({"Error":"Species not found"})
    }else{
        response.status(200).json(result);
    }
    return response;
}

export {getAllEntriesHandler,getSpecificEntryHandler,addNewSpeciesHandler,addImageToSpeciesHandler,
        updateSpeciesHandler,deleteSpeciesHandler,clearAllSpeciesHandler,addSpeciesLinkHandler,getSpeciesLinkHandler,updateSpeciesLinkHandler,deleteSpeciesLinkHandler,getAllSpeciesLinksHandler,addAudioToSpeciesHandler,getAllDistinctTagsHandler}
