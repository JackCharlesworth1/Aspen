import {useState,useEffect} from 'react';

const DirectionsButton=({start=null,end=null,method=null})=>{

    const [showDirections,setShowDirections]=useState(false); 
    const [directions,setDirections]=useState(false);

    const enableTextInstructions=async ()=>{
        setShowDirections(true);
        if(!directions&&window.google){
            fetchNewMapInstructions();
        }else{
            console.log("Didn't request directions, they may have already been gotten:",directions," or google maps api couldn't be loaded: ",window.google)
        }
    }

    const fetchNewMapInstructions=()=>{
        const directionsService = new google.maps.DirectionsService();
        const request={origin:start,destination:end,travelMode:method.toUpperCase()};
        directionsService.route(request,(result,status)=>{
            if(status===google.maps.DirectionsStatus.OK){
                const instructions=[];
                for(let i=0;i<result.routes[0].legs.length;i++){
                    for(let j=0;j<result.routes[0].legs[i].steps.length;j++){
                        instructions.push(result.routes[0].legs[i].steps[j].instructions.replace(/<[^>]+>/g, ''))
                    }
                }
                if(instructions[instructions.length-1].includes("Destination")){
                    const penultimate_instruction=instructions[instructions.length-1].slice(0,instructions[instructions.length-1].indexOf("Destination"))
                    const last_instruction=instructions[instructions.length-1].slice(instructions[instructions.length-1].indexOf("Destination"),instructions[instructions.length-1].length)
                    instructions.pop()
                    instructions.push(penultimate_instruction)
                    instructions.push(last_instruction)
                }
                setDirections(instructions);
            }else{
                console.log("Directions request failure:",status);
            }
        })

    }


    const disableTextInstructions=()=>{
        setShowDirections(false)
    }

    useEffect(()=>{
        if(directions&&window.google){
            fetchNewMapInstructions();
        }
    },[start,end,method])

    return start&&end&&method&&(<>
            <button onClick={()=>enableTextInstructions()}>Get Text Directions</button>
            {showDirections&&(<div style={{border:"2px solid black",padding: "20px"}}>
                <button style={{border:"2px solid black",padding:"4px",margin:"5px"}} onClick={disableTextInstructions}>X</button>
                {Array.isArray(directions)&&directions.map((instruction,index)=>{
                    return <li key={index}>{instruction}</li>
                })}
            </div>)}
        </>
    )

}
export default DirectionsButton;
