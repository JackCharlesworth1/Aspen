import {useState,useEffect} from 'react'
import styles from '../css/ToggleSeenButton.module.css'

const ToggleSeenButton=({buttonUnseenText="O",buttonSeenText="X",username="",species_name=""})=>{
    const [seen,setSeen]=useState(false);
    
    const initaliseButtonState=async ()=>{
        if(username&&species_name){
            const result=await fetch("https://api.theaspenproject.cloud/api/user/speciesSeen/"+username+"/"+species_name,{method:"GET",headers:{"Content-Type":"application/json"}})
            const result_data=await result.json()
            if("species_seen" in result_data){
                setSeen(result_data.species_seen)
            }else{
                console.log("Something went wrong fetching seen status:"+result_data)
            }
        }else{
            console.log("Warning, toggle seen button wont' be interactive because username/species hasn't been supplied to the component")
        }
    }

    useEffect(()=>{
        initaliseButtonState()
    },[species_name])

    const toggleSeen=async (event_)=>{
        event_.preventDefault()
        const next_state=!seen
        setSeen(next_state)
        const request_body_data={
            name:username,
            species:species_name,
            seen:next_state
        }
        const result=await fetch("https://api.theaspenproject.cloud/api/user/speciesSeen",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(request_body_data)})
        const result_data=await result.json()
        if(!result_data.success){
            console.log("Warning, updating seen state failed on server side:"+result_data)
        }
    }

    return (
        <button className={styles.ToggleSeenButton} onClick={toggleSeen}>{seen?buttonSeenText:buttonUnseenText}</button>
    )

}

export default ToggleSeenButton;
