import {useState,useEffect} from 'react'
const UserStats=({user_seen,user_sightings})=>{

	const [speciesData,setSpeciesData]=useState([]);
	const [tags,setTags]=useState([])
	const [sortedSeenSpecies,setSortedSeenSpecies]=useState([]);
	const [mixedSightings,setMixedSightings]=useState([]);
	
	const prepareUserStats=()=>{
		sortSeenSpecies();
		mixSightings();
	}

	const sortSeenSpecies=async ()=>{
		const token=localStorage.getItem("accessToken")
		const species_data_response=await fetch("https://api.theaspenproject.cloud/api/species/",{headers:{"Authorization":token}});
		const tags_response=await fetch("https://api.theaspenproject.cloud/api/species/tags/",{headers:{"Authorization":token}});
		if(!(species_data_response.status===200&&tags_response.status===200)){
			return;
		}
		const species_data=await species_data_response.json()
		const tags_data=await tags_response.json();
		setSpeciesData(species_data)
		setTags(tags_data);
		if(user_seen){
			const tag_seen_count={}
			for(let i=0;i<tags_data.length;i++){
				tag_seen_count[tags_data[i]]=0;
			}
			for(let j=0;j<user_seen.length;j++){
				let species_object_to_index=null;
				for(let k=0;k<species_data.length;k++){
                    console.log(species_data[k].SpeciesName,"Vs",user_seen[j],typeof species_data[k].SpeciesName,typeof user_seen[j])
					if(species_data[k].SpeciesName===user_seen[j]){
                        console.log("Found the relevant species object")
						species_object_to_index=speciesData[k]
					}
				}
                console.log("Species Data:",species_data,"Object To Index",species_object_to_index)
                if(species_object_to_index){
				    for(let l=0;l<tags_data.length;l++){
					    if(species_object_to_index.SpeciesTags.includes(tags_data[l])){
						    tag_seen_count[tags_data[l]]=tag_seen_count[tags_data[l]]+1;	
					    }
				    }
                }
			}
			const sorted_tag_data=[];
			sorted_tag_data.push(tags_data[0])
			for(let m=1;m<tags_data.length;m++){
				let assumed_index=0;
				while(tag_seen_count[sorted_tag_data[assumed_index]]>tag_seen_count[tags_data[m]]){
					assumed_index++;
				}
				if(assumed_index===sorted_tag_data.length){
					sorted_tag_data.push(tags_data[m])
				}else{
					sorted_tag_data.splice(assumed_index,0,tags_data[m])
				}
			}
			setSortedSeenSpecies(sorted_tag_data)
		}
		
	}


	const mixSightings=()=>{
        console.log("User Sightings:",user_sightings)
		const user_sightings_count={}
		for(let i=0;i<user_sightings.length;i++){
			if(Object.keys(user_sightings_count).includes(user_sightings[i])){
				user_sightings_count[user_sightings[i]]=user_sightings_count[user_sightings[i]]+1
			}else{
				user_sightings_count[user_sightings[i]]=1;
			}	
		}
        console.log("User Sightings Count",user_sightings_count)
		const sorted_sightings=[];
		sorted_sightings.push(user_sightings[0])
		for(let j=1;j<Object.keys(user_sightings_count).length;j++){
			let assumed_index=0;	
			while(user_sightings_count[sorted_sightings[assumed_index]]>user_sightings_count[Object.keys(user_sightings_count)[j]]){
				assumed_index++
			}
			if(assumed_index===sorted_sightings.length){
				sorted_sightings.push(Object.keys(user_sightings_count)[j])
			}else{
				sorted_sightings.splice(assumed_index,0,Object.keys(user_sightings_count)[j])
			}
		}
        console.log("Sorted Sightings:",sorted_sightings)
		const ordered_sightings=[]
		for(let k=0;k<user_sightings_count[sorted_sightings[0]];k++){
			ordered_sightings.push(sorted_sightings[0]);
		}
        if(sorted_sightings.length>1){
		    for(let l=1;l<sorted_sightings.length;l++){
			    const places_per_interval=Math.ceil((ordered_sightings.length-1)/user_sightings_count[sorted_sightings[l]])
			    for(let m=user_sightings_count[sorted_sightings[l]];m>0;m--){
                    console.log("Calculating the ",m,"th insertion, with",places_per_interval,"as interval on list",ordered_sightings)
				    if(places_per_interval*m>=ordered_sightings.length){
					    ordered_sightings.push(sorted_sightings[l])
				    }else{
					    ordered_sightings.splice(places_per_interval*m,0,sorted_sightings[l])
				    }
			    }
		    }
        }
        console.log("Ordered Sightings",ordered_sightings);
		setMixedSightings(ordered_sightings)
		
	}

	useEffect(()=>{prepareUserStats()},[user_seen,user_sightings])
	return (<>
			{(sortedSeenSpecies.length>0)&&<div>
				<h5>What you see the most:</h5>
				<ol>
                   	{(sortedSeenSpecies.length>4)&&<li>{sortedSeenSpecies[sortedSeenSpecies.length-1]}</li>}
					{(sortedSeenSpecies.length>5)&&<li>{sortedSeenSpecies[sortedSeenSpecies.length-2]}</li>}
					{(sortedSeenSpecies.length>6)&&<li>{sortedSeenSpecies[sortedSeenSpecies.length-3]}</li>}

				</ol>
			</div>}
			{(sortedSeenSpecies.length>4)&&<div>
				<h5>What you see least:</h5>
				<ol>
                    {(sortedSeenSpecies.length>0)&&<li>{sortedSeenSpecies[0]}</li>}
					{(sortedSeenSpecies.length>1)&&<li>{sortedSeenSpecies[1]}</li>}
					{(sortedSeenSpecies.length>2)&&<li>{sortedSeenSpecies[2]}</li>}
				</ol>
			</div>}
            {mixedSightings&&<div>
                {mixedSightings.map((sighting)=>{return <p>{sighting}</p>})}
            </div>}
		</>)
}

export default UserStats

