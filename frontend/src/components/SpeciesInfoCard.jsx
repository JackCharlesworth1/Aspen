import {useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleXmark} from '@fortawesome/free-solid-svg-icons';
import {faCircleCheck} from '@fortawesome/free-solid-svg-icons';
import Sightings from './Sightings.jsx'
import SpeciesDescription from './SpeciesDescription.jsx'
import ToggleSeenButton from './ToggleSeenButton.jsx'
import TaxonomyInfo from './TaxonomyInfo.jsx'
import MappingTile from './MappingTile.jsx'
import LocationFinder from './LocationFinder.jsx'
import styles from '../css/SpeciesInfoCard.module.css'

const SpeciesInfoCard=({species_name})=>{
    const navigate=useNavigate()
    const name=species_name;
    const [speciesInfo,setSpeciesInfo]=useState(null)
    const [username,setUsername]=useState("");
    const [audioFile,setAudioFile]=useState(null);
    const [commonNames,setCommonNames]=useState([]);
    const [subscribed,setSubscribed]=useState(false);

    const fetchSpeciesData=async()=>{
        const token=localStorage.getItem("accessToken")
        const fetchedAudioFile=await fetch("https://api.theaspenproject.cloud/api/static/audio/"+name.toLowerCase()+".mp3",{headers:{"Authorization":token}})
        if(fetchedAudioFile.status===200){
            const audioBlob=await fetchedAudioFile.blob()
            setAudioFile(audioBlob);
        }
        const percieved_username=localStorage.getItem("client_percieved_username")

        if(percieved_username){
            setUsername(percieved_username)
        }

        const account_info_response=await fetch("https://api.theaspenproject.cloud/api/account/info/"+percieved_username,{headers:{"Content-Type":"application/json","Authorization":token}})
        if(!account_info_response.ok){
            console.log("Failed to set account info, the request failed",account_info_response)
        }else{
            const account_info=await account_info_response.json()
            setSubscribed(account_info.subscribed);
        }

        try{
            const res=await fetch("https://api.theaspenproject.cloud/api/species/"+name,{headers:{"Authorization":token}})
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
                            <div>
                                <img src={"https://api.theaspenproject.cloud/api/static/images/"+species_name.replace(" ","_").toLowerCase()+".jpg"} className={styles.IconImage}/>
                                <h1 className={styles.SpeciesTitle}>{speciesInfo.SpeciesName}</h1>
                                {speciesInfo.ScientificName&&<h3 className={styles.ScientificTitle}>{speciesInfo.ScientificName}</h3>}
                                    {commonNames.length!==0&&(<div className={styles.CommonNames}> • 
                                        {commonNames.map((common_name,index)=>(common_name.toLowerCase()!==speciesInfo.SpeciesName.toLowerCase())&&(<>{common_name+" • "}</>))}
                                    </div>)}
                                {audioFile&&(<div className={styles.AudioContainer}><audio className={styles.AudioPlayer} controls><source src={URL.createObjectURL(audioFile)} /></audio></div>)}
                                <br />

                                <SpeciesDescription description={speciesInfo.SpeciesDescription}/>
                            </div>
                            <div>
                                {speciesInfo&&speciesInfo.TaxonomyInfo&&<TaxonomyInfo taxonomy_info={speciesInfo.TaxonomyInfo}/>}
                                {speciesInfo.SpeciesTags&&(<div className={styles.TagInfoDiv}>
                                    <h3>Tags</h3>
                                    <ul>
                                        {speciesInfo.SpeciesTags.map((tag)=>{
                                            return <li>{tag}</li>
                                        })}
                                    </ul>
                                </div>)}
                            </div>
                            <div className={styles.OccurencesContainer}>
                                <h3>Reported Sightings</h3>
                                <MappingTile species_name={name} />
                            </div>
                            <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
                                <div className={styles.SightingLeftContainer}>
                                    <h3 style={{marginLeft:"40px"}}>Your Sightings</h3>
                                    {(username&&(<div className={styles.SeenSection}><div className={styles.ToggleSeenDiv}><p className={styles.SeenLabel} >Seen:</p><ToggleSeenButton buttonSeenText={<FontAwesomeIcon icon={faCircleCheck}/>} buttonUnseenText={<FontAwesomeIcon icon={faCircleXmark} />} username={username} species_name={name}/></div><br /><p style={{marginLeft:"40px"}}>Click the button when you have seen the species in real life</p></div>))}
                                </div>
                                <Sightings username={username} speciesName={name}/>
                            </div>
                            <div style={styles.NearbyLocationsSection}>
                                <h3 style={{marginLeft:"0px"}}>Possible Locations Nearby</h3>
                                {subscribed?<LocationFinder species={species_name}/>:<div>Subscribe to get directions to possible sighting spots</div>}
                            </div>

                    </>
               )

    }

    useEffect(()=>{fetchSpeciesData();setAudioFile(null);setCommonNames([])},[species_name])


    return (
        <div className={styles.InfoCard}>
            {speciesInfo ? infoCard():infoCardSkeleton()}
        </div> 
    )
}
export default SpeciesInfoCard
