import axios from 'axios'
import path from 'path'
import fs from 'fs'


function getMapData(species_name){
    axios.get("https://api.gbif.org/v1/map/occurrence/")
}

const getSpeciesInfoByCommonName= async(informal_name)=>{
  const response = await fetch("https://api.gbif.org/v1/species/search?q="+informal_name);
  const data = await response.json();

  for (const result of data.results){
    const match = result.vernacularNames.some(vernacular =>
      vernacular.vernacularName.toLowerCase().includes(informal_name.toLowerCase())
    );
    if (match) {
      if(result.taxonID){
        if(result.taxonID.includes("gbif")){
      let scientific_name=result.scientificName;
      if(scientific_name.includes(" ")){
        scientific_name=scientific_name.split(" ")[0].trim()+" "+scientific_name.split(" ")[1].trim();
        scientific_name=scientific_name.replace(",","")
      }
      let taxon_id=result.taxonID.split(/[:/]/).pop().trim();
      let common_names=[]
      result.vernacularNames.forEach((vernacular_name)=>{
        if(vernacular_name.language==="eng"){
            let to_remove=[]
            let adding_name=true;
            common_names.forEach((name)=>{
                if(name.includes(vernacular_name.vernacularName)){
                    to_remove.push(name)
                }
                if(vernacular_name.vernacularName.includes(name)){
                    adding_name=false;
                }
            })
            if(adding_name){
                common_names.push(vernacular_name.vernacularName);
            }
            to_remove.forEach((name)=>common_names=common_names.filter((item)=>item!==name))
        }
      })
      return {ScientificName:scientific_name,
              TaxonKey:taxon_id,
              CommonNames:common_names,
              TaxonomyInfo:{
                    Kingdom:result.kingdom,
                    Phylum:result.phylum,
                    Order:result.order,
                    Family:result.family,
                    Genus:result.genus
              }}}}
    }
  }
  return null; // No matching species found
};

const getMapDataForSpecies=async(taxon_key,species_name)=>{
    const response=await fetch("https://api.gbif.org/v2/map/occurrence/density/0/0/0%404x.png?srs=EPSG%3A3857&style=greenHeat.point&taxonKey="+taxon_key)    
    if(response.status===200){
        const image_blob=await response.blob()
        saveImageBlob(species_name,image_blob)
        return {"success":true}
    }
    return null;
}

const saveImageBlob=async (name,blob)=>{
    const filename=name.toLowerCase()+".png"
    const __dirname=import.meta.dirname
    let filepath=path.join(__dirname,'..','..','static','images','maps',filename)
    let dir_path=path.dirname(filepath)
    let buffer=await blob.arrayBuffer();
    buffer=await Buffer.from(buffer)
    await fs.mkdir(dir_path,{recursive:true})
    await fs.createWriteStream(filepath).write(buffer)
    return "Success"
}

export {getSpeciesInfoByCommonName,getMapDataForSpecies} 
