import {useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Sightings from './Sightings.jsx'
import SpeciesDescription from './SpeciesDescription.jsx'
import ToggleSeenButton from './ToggleSeenButton.jsx'
import TaxonomyInfo from './TaxonomyInfo.jsx'
import MappingTile from './MappingTile.jsx'
import styles from '../css/SpeciesInfoCard.module.css'

const SpeciesInfoCard=({species_name})=>{
    const navigate=useNavigate()
    const name=species_name;
    const [speciesInfo,setSpeciesInfo]=useState(null)
    const [username,setUsername]=useState("");
    const [audioFile,setAudioFile]=useState(null);
    const [commonNames,setCommonNames]=useState([]);

    const fetchSpeciesData=async()=>{
        const token=localStorage.getItem("accessToken")
        const fetchedAudioFile=await fetch("/api/static/audio/"+name.toLowerCase()+".mp3",{headers:{"Authorization":token}})
        if(fetchedAudioFile.status===200){
            const audioBlob=await fetchedAudioFile.blob()
            setAudioFile(audioBlob);
        }
        const percieved_username=localStorage.getItem("client_percieved_username")

        if(percieved_username){
            setUsername(percieved_username)
        }

        try{
            const res=await fetch("/api/species/"+name,{headers:{"Authorization":token}})
            if(!res.ok){
                console.log("Error, fetching data on species failed (bad request): ")
                return navigate("/user/request-error")
            }
            const data=await res.json()
            setSpeciesInfo(data)
            if(data.CommonNames){
                filterCommonNames(data.SpeciesName,data.CommonNames);
            }
        }catch(error){
            console.log("Error fetching data on species: "+error)
            return navigate("/user/request-error")
        }
    }


    const infoCardSkeleton=()=>{
        return (
                    <div>

                    </div>
               )
    }

    const filterCommonNames=(species_name,common_names)=>{
        const common_names_expanded=[]
        common_names.forEach((common_name_entry)=>{
            common_names_expanded.push(...(common_name_entry.split(",")))
        })
        const distinct_common_names_set=new Set();
        for(let i=0;i<common_names_expanded.length;i++){
            const title_case_common_name=common_names_expanded[i].split(' ').map((letters) => letters&&(letters[0].toUpperCase() + letters.substring(1).toLowerCase())).join(' ');
            distinct_common_names_set.add(title_case_common_name.trim())
        }
        const distinct_common_names=Array.from(distinct_common_names_set);
        const original_common_names=distinct_common_names.filter((common_name,index)=>common_name.toLowerCase()!==species_name.toLowerCase())
        setCommonNames(original_common_names)
    }

    const infoCard=()=>{
        return (
                    <>
                            <img src={"/api/static/images/"+species_name.toLowerCase()+".jpg"} className={styles.IconImage}/>
                            <h3 className={styles.SpeciesTitle}>{speciesInfo.SpeciesName}</h3>
                            {speciesInfo.ScientificName&&<h6 className={styles.ScientificTitle}>{speciesInfo.ScientificName}</h6>}
                            {commonNames.length!==0&&(<div className={styles.CommonNames}> • 
                                    {commonNames.map((common_name,index)=>(common_name.toLowerCase()!==speciesInfo.SpeciesName.toLowerCase())&&(<>{common_name+" • "}</>))}
                                    </div>)}
                            {(username&&(<div className={styles.ToggleSeenDiv}><p>Seen:</p><ToggleSeenButton buttonSeenText="X" buttonUnseenText="O" username={username} species_name={name}/></div>))}
                            {audioFile&&(<audio controls><source src={URL.createObjectURL(audioFile)} /></audio>)}
                            <SpeciesDescription description={speciesInfo.SpeciesDescription}/>
                            {speciesInfo&&speciesInfo.TaxonomyInfo&&<TaxonomyInfo taxonomy_info={speciesInfo.TaxonomyInfo}/>}
                            <MappingTile species_name={name} />
                            <Sightings username={username} speciesName={name}/>

                            {speciesInfo.SpeciesTags&&(<div>
                                <h3>Tags</h3>
                                <ul>
                                    {speciesInfo.SpeciesTags.map((tag)=>{
                                        return <li>{tag}</li>
                                    })}
                                </ul>
                            </div>)}
                    </>
               )

    }

    useEffect(()=>{fetchSpeciesData()},[species_name])

    return (
        <div className={styles.InfoCard}>
            {speciesInfo ? infoCard():infoCardSkeleton()}
        </div> 
    )
}
export default SpeciesInfoCard
