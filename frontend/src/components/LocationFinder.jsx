import { useState,useEffect } from 'react'
import GoogleMapsPathEmbed from './GoogleMapsPathEmbed.jsx'
import DirectionsButton from './DirectionsButton.jsx'
import TravelModeRadioButtons from './TravelModeRadioButtons.jsx'
import styles from '../css/LocationFinder.module.css'

function LocationFinder({species}) {
    const [count, setCount] = useState(0)
    const [method,setMethod] = useState("driving")
    const [originCoordinates,setOriginCoordinates]=useState(null)
    const [originOverride,setOriginOverride]=useState("");
    const [origin,setOrigin]=useState("");
    const [destinations,setDestinations]=useState([]);
    const [destination,setDestination]=useState("");
    
    const location_success_handler=(position)=>{
        console.log(position)
        setOriginCoordinates(position.coords);
        setOrigin(position.coords.latitude+","+position.coords.longitude)
        console.log("Got Coordinates",position.coordinates)
    }

    const location_error_handler=(error)=>{
        console.log("Error getting user's location: ",error.code,error.message)
    }

    const getLongitudeAndLattitude=()=>{
        navigator.geolocation.getCurrentPosition(location_success_handler,location_error_handler,{enableHighAccuracy: true,maximumAge:0})
    }

    const overrideChange=(_event)=>{
        setOriginOverride(_event.target.value)
    }

    const overrideOrigin=()=>{
        setOrigin(originOverride);
    }

    const cancelOriginOverride=()=>{
        setOrigin(originCoordinates.latitude+","+originCoordinates.longitude)
        console.log("Set origin to",originCoordinates.latitude+","+originCoordinates.longitude)
    }

    useEffect(()=>{
        getLongitudeAndLattitude();
    },[])

    const findNearbyLocation=async ()=>{
        const access_token=localStorage.getItem("accessToken")
        const backend_response=await fetch('https://api.theaspenproject.cloud/api/external/getNearbySpeciesLocations/'+species+"/"+origin,{headers:{"Authorization":access_token,"Content-Type":"application/json"}})
        if(!backend_response.ok){
            console.log("Error making request to backend in an attempt to fetch locations:",backend_response)
        }
        const response_data=await backend_response.json();
        console.log("Backend responded with the json",response_data)

        setDestinations(response_data.locations)
    }


  return (
    <>
          <label>If you have location disabled or want to start from somewhere else, manually enter your location</label>
          <br />
          <input className={styles.OverrideInput} value={originOverride} onChange={overrideChange} type="text" placeholder="E.g. Harborne, Birmingham"/>
          <div className={styles.OverrideButtonDiv}>
                <button className={styles.OverrideButton} onClick={overrideOrigin}>Override</button>
                <button className={styles.OverrideButton} onClick={cancelOriginOverride}>Cancel</button>
          </div>
          <br />
          {origin&&<div>
            <button className={styles.OverrideButton} onClick={findNearbyLocation}>Find Nearby Locations</button>
            {destinations&&<div>
                    {(destinations.length!==0)&&<p style={{marginLeft:"0px"}}>Places that you may be able to see the species in:</p>}
                    <div className={styles.PossibleLocationsContainer}>
                        {destinations.map((destination_option,index)=>{
                            return (<button className={styles.OverrideButton} onClick={()=>setDestination(destinations[index])}>{destination_option}</button>)
                        })}
                    </div>
            </div>}
          </div>}
          {origin&&destination&&(<div style={{width: "100%"}}>
                <TravelModeRadioButtons setMethod={setMethod} method={method} />
                <GoogleMapsPathEmbed start={origin} end={destination} method={method} />
                <DirectionsButton start={origin} end={destination} method={method} />
          </div>)}
    </>
  )
}

export default LocationFinder;
