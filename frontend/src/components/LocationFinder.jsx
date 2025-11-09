import { useState,useEffect } from 'react'
import GoogleMapsPathEmbed from './GoogleMapsPathEmbed.jsx'
import DirectionsButton from './DirectionsButton.jsx'
import TravelModeRadioButtons from './TravelModeRadioButtons.jsx'

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
        const backend_response=fetch('https://api.theaspenproject.cloud/api/external/getNearbySpeciesLocations/'+species+"/"+origin,{headers:{"Authorization":access_token,"Content-Type":"application/json"}})
        if(!backend_response.ok){
            console.log("Error making request to backend in an attempt to fetch locations")
        }
        const response_data=await backend_response.json();

        setDestinations(response_data.locations)
    }


  return (
    <>
          <label>Start Point Override</label>
          <input value={originOverride} onChange={overrideChange} type="text" placeholder="E.g. Harborne, Birmingham"/>
          <button onClick={overrideOrigin}>Override</button>
          <button onClick={cancelOriginOverride}>Cancel</button>

          <br />
          {origin&&<div>
            <button onClick={findNearbyLocation}>Find Location</button>
            {destinations.map((destination_option,index)=>{
                  return <li><button onClick={()=>setDestination(destinations[index])}>{destination_option}</button></li>})
            }
          </div>}
          {origin&&destination&&(<div style={{width: "1000px",height:"1000px"}}>
                <TravelModeRadioButtons setMethod={setMethod} method={method} />
                <GoogleMapsPathEmbed start={origin} end={destination} method={method} />
                <DirectionsButton start={origin} end={destination} method={method} />
          </div>)}
    </>
  )
}

export default LocationFinder;
