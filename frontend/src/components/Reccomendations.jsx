import {useState,useEffect} import 'react'
import SpeciesCard from './SpeciesCard.jsx'
import styles from '../css/SpeciesTable.module.css'

const Reccomendations=({reccomendation_tags,introduction})=>{
    const [reccomendations,setReccomendations]=useState([]) 

    const fetchReccomendations=async ()=>{
        const token=localStorage.getItem("accessToken")
        const species_response=await fetch("https://api.theaspenproject.cloud/api/species",{headers:{"Authorization":token,"Content-Type":"application/json"}})
        if(!species_response.ok){
            console.log("Error fetching species data, request not ok, if this doesn't go through, reccomendations can't be made, the response was,",species_response)
            return;
        }
        const species_data=await species_response.json();
        const species_names=species_data.map(species_object=>species_object.SpeciesName)
        const reccomendation_body={tags:reccomendation_tags,possible_species:species_names}
        const reccomendations_response=await fetch("https://api.theaspenproject.cloud/api/external/reccomendations",{method:"POST",headers:{"Authorization":token,"Content-Type":"application/json"},body:reccomendation_body})
        if(!reccomendations_response){
            console.log("Error fetching reccomendation data, request failed, the response was",reccomendations_response)
            return;
        }
        const reccomendation_object=await reccomendations_response.json()
        setReccomendations(reccomendation_object.reccomendations)
    }

    useEffect(()=>{
        fetchReccomendations();
    },[reccomendation_tags])

    const linkPrefix="/user/map/"

    return (
        <div>
            {(reccomendations.length>0)&&<div className={styles.SpeciesTableContainer}>
                <ul className={styles.SpeciesTable}>
                    {reccomendations.map((species_name)=>{
                        <li className={styles.cardTableItem}><Link className={styles.CardLink} to={linkPrefix+species_name}><SpeciesCard species_name={species_name} tabled={true} active={true} /></Link></li>

                        <SpeciesCard species_name={species_name} tabled={true}/>
                    )}
                </ul>
            </div>}
        </div>
    )
}

export default Reccomendations;
