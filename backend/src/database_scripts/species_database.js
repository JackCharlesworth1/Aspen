import {connectToMongo,addNewItem,getOne,getAll,dropCollection,deleteByQuery,updateItem,getAllOfOneField} from './generic_database.js'
import {deleteSpeciesLinkDescription} from './species_links_database.js'

const database_endpoint_url=process.env.DATABASE_ENDPOINT_URI

const db_connection=await connectToDatabase();

async function connectToDatabase(){
    const db_connection=await connectToMongo(database_endpoint_url);
    return db_connection; 
}

async function getDBConnection(){
    return db_connection;
}

async function addNewSpecies(db_connection,species_json){
    const result=await addNewItem(db_connection,"SpeciesMap",species_json);
    return result
}

async function addNewSpeciesDisposable(species_json){
    const db_connection=await connectToDatabase();
    const result=addNewSpecies(db_connection,species_json); 
    return result;
}

async function getEntryByName(db_connection,name){
    const result=await getOne(db_connection,"SpeciesMap",{SpeciesName:name});
    return result;
}

async function getAllEntries(db_connection){
    const result=await getAll(db_connection,"SpeciesMap")
    return result;
}

async function getAllEntriesDisposable(){
    const db_connection=await connectToDatabase();
    const results=await getAllEntries(db_connection);
    return results    
}

async function clearSpeciesCollection(db_connection){
    const result=await dropCollection(db_connection,"SpeciesMap") 
}

async function deleteSpeciesByName(db_connection,name){
    const past_species=await getEntryByName(db_connection,name)
    const query={SpeciesName:name}
    const result=await deleteByQuery(db_connection,"SpeciesMap",query)
    if(!(past_species instanceof Error)){
        if(past_species.SpeciesLinks){
            for(let i=0;i<past_species.SpeciesLinks.length;i++){
                await removeLinkFromSpecies(db_connection,past_species.SpeciesLinks[i],name)
            }
        }
    }

    return result
}

async function updateSpeciesByName(db_connection,name,new_item){
    const previous_item=await getEntryByName(db_connection,name);
    const result=await updateItem(db_connection,"SpeciesMap",{SpeciesName:name},new_item)
    if((!(previous_item instanceof Error))&&("SpeciesLinks" in new_item)){
        addLinksToCorrespondingSpecies(db_connection,previous_item.SpeciesLinks,new_item);
    }
    return result;
}

async function addLinkToSpecies(db_connection,species_to_add_to,species_to_add){
    const current_entry=await getEntryByName(db_connection,species_to_add_to);
    if(!(current_entry instanceof Error)){
        let species_links;
        if(current_entry.SpeciesLinks){
            species_links=current_entry.SpeciesLinks;
        }else{
            species_links=[]
        }
        species_links.push(species_to_add)
        await updateSpeciesByName(db_connection,species_to_add_to,{SpeciesLinks:species_links})
    }
    
}

async function removeLinkFromSpecies(db_connection,species_to_remove_from,species_to_remove){
    const species=await getEntryByName(db_connection,species_to_remove_from)
    if(species){
        if(species.SpeciesLinks){
            const species_links=species.SpeciesLinks;
            const updated_links=species_links.filter(item=>item!==species_to_remove)
            await updateSpeciesByName(db_connection,species_to_remove_from,{SpeciesLinks:updated_links})
            await deleteSpeciesLinkDescription(db_connection,species_to_remove,species_to_remove_from);
        }
    }
}

async function addLinksToCorrespondingSpecies(db_connection,old_links,species_object){
    if(species_object){
        if(species_object.SpeciesName&&species_object.SpeciesLinks&&old_links){
                let links_to_update=species_object.SpeciesLinks;
                let links_to_ignore=[]
                let found;
                for(let i=0;i<old_links.length;i++){
                    found=false;
                    for(let j=0;j<links_to_update.length;j++){
                        if(old_links[i]===links_to_update[j]){
                            if(!(links_to_ignore.includes(j))){
                                links_to_ignore.push(j)
                                found=true;
                            }
                        }
                    }
                    if(!found){
                        //Delete link that is no longer there
                        removeLinkFromSpecies(db_connection,old_links[i],species_object.SpeciesName) 
                        //removeLinkFromSpecies(db_connection,species_object.SpeciesName,old_links[i]) 

                    }
                }
                links_to_ignore.sort().reverse()
                for(let k=0;k<links_to_ignore.length;k++){
                    links_to_update.splice(links_to_ignore[k],1)
                }
                for(let l=0;l<links_to_update.length;l++){
                    await addLinkToSpecies(db_connection,links_to_update[l],species_object.SpeciesName);
                }
        }
    }
}

async function getAllDistinctTags(db_connection){
    const results=await getAllOfOneField(db_connection,"SpeciesMap","SpeciesTags") 
    if(!(results instanceof Error)){
        const flattend_array=results.flat(2)
        const unique_array=flattend_array.filter((value,index,array)=>array.indexOf(value)===index)
        return unique_array;
    }
    return results;
}

export {connectToDatabase,getDBConnection,clearSpeciesCollection,addNewSpecies,deleteSpeciesByName,getEntryByName,getAllEntries,updateSpeciesByName,addLinksToCorrespondingSpecies,getAllDistinctTags}
