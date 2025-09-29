import {connectToMongo,addNewItem,getOne,getAll,dropCollection,deleteByQuery,updateItem} from './generic_database.js'

async function addNewSpeciesLink(db_connection,species_one,species_two,link_description,link_type){
    const firstSpecies=(species_one<species_two ? species_one : species_two)
    const secondSpecies=(species_one<species_two ? species_two : species_one)
    const link_item={
        SpeciesOne: firstSpecies,
        SpeciesTwo: secondSpecies,
        LinkDescription:link_description,
        LinkType:link_type,
    }
    const result=await addNewItem(db_connection,"SpeciesLinks",link_item);
    return result;
}


async function getSpeciesLinkDescription(db_connection,species_one,species_two){
    const firstSpecies=(species_one<species_two ? species_one : species_two)
    const secondSpecies=(species_one<species_two ? species_two : species_one)


    const result=await getOne(db_connection,"SpeciesLinks",{SpeciesOne:firstSpecies,SpeciesTwo:secondSpecies});
    if(!result||result instanceof Error){
        return result;
    }else{
        return result.LinkDescription;
    }
}

async function getSpeciesLinkType(db_connection,species_one,species_two){
    const firstSpecies=(species_one<species_two ? species_one : species_two)
    const secondSpecies=(species_one<species_two ? species_two : species_one)

    const result=await getOne(db_connection,"SpeciesLinks",{SpeciesOne:firstSpecies,SpeciesTwo:secondSpecies});
    if(!result||result instanceof Error){
        return result;
    }else{
        return result.LinkType;
    }
}

async function getAllSpeciesLinkDescriptions(db_connection){
    const result=await getAll(db_connection,"SpeciesLinks");
    return result;
}

async function updateSpeciesLinkDescription(db_connection,species_one,species_two,link_description,link_type){
    const firstSpecies=(species_one<species_two ? species_one : species_two)
    const secondSpecies=(species_one<species_two ? species_two : species_one)
    const result=await updateItem(db_connection,"SpeciesLinks",{SpeciesOne:firstSpecies,SpeciesTwo:secondSpecies},{LinkDescription:link_description,LinkType:link_type});
    return result;
}


async function deleteSpeciesLinkDescription(db_connection,species_one,species_two){
    const firstSpecies=(species_one<species_two ? species_one : species_two)
    const secondSpecies=(species_one<species_two ? species_two : species_one)

    const query={SpeciesOne:firstSpecies,SpeciesTwo:secondSpecies}
    const result=await deleteByQuery(db_connection,"SpeciesLinks",query)

    return result;
}

export {addNewSpeciesLink,getSpeciesLinkDescription,updateSpeciesLinkDescription,deleteSpeciesLinkDescription,getAllSpeciesLinkDescriptions,getSpeciesLinkType}
