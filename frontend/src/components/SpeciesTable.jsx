import {useState,useEffect} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import SpeciesCard from './SpeciesCard.jsx'
import TagFilterDropdown from './TagFilterDropdown.jsx'
import Searchbar from './Searchbar.jsx'
import styles from '../css/SpeciesTable.module.css'

const SpeciesTable=({linkPrefix})=>{
    const navigate=useNavigate()
    const [menuData,setMenuData]=useState(null);
    const [tags,setTags]=useState([]);
    const [tagFilters,setTagFilters]=useState([])
    const [speciesToDisplay,setSpeciesToDisplay]=useState([])
    const [searchString,setSearchString]=useState("");


    const initializeMenu=async ()=>{
        const token=localStorage.getItem("accessToken");
        const results=await fetch("/api/species/",{headers:{"Authorization":token}});
        const tags=await fetch("/api/species/tags/",{headers:{"Authorization":token}});
        if(!results.ok){
            throw new Error("Error making species fetch request")
        }
        try{
            const data=await results.json()
            await setMenuData(data);
            setSpeciesToDisplay(data)
        }catch(error){
           throw new Error("Error converting fetched species data to json: ",error) 
        }
        if(tags.status===200){
            const tag_data=await tags.json()
            setTags(tag_data)
        }else{
            console.log("Error fetching distinct tags")
        }
    }

    const getTagFilters=()=>{
        return [...tagFilters]
    }

    const changeTagFilters=(tag_filters)=>{
        setTagFilters(tag_filters)
        determineValidSpeciesToDisplay(searchString,tag_filters)
    }

    const getSearchString=()=>{
        return searchString 
    }
    const changeSearchString=(search_string)=>{
        setSearchString(search_string)
        determineValidSpeciesToDisplay(search_string,tagFilters);
    }

    const determineValidSpeciesToDisplay=(search_string,tag_filters)=>{
        if(menuData){
            const items_relevant_to_search=menuData.filter((species)=>species.SpeciesName.toLowerCase().includes(search_string.toLowerCase()));
            if(tag_filters.includes(true)){
            let applied_filters=[];
            tag_filters.forEach((tag_filter,index)=>{
                if(tag_filter){
                    applied_filters.push(tags[index])
                }
            })
            const items_to_display=[]
            items_relevant_to_search.forEach((species)=>{
            if(species.SpeciesTags){
                        if(applied_filters.every((applied_filter)=>species.SpeciesTags.includes(applied_filter))){
                            items_to_display.push(species)
                        }
                    }
                })
                setSpeciesToDisplay(items_to_display)
            
            }else{
                setSpeciesToDisplay(items_relevant_to_search)
            }
        }
    }


    const navigateToRandomPage=()=>{
        navigate("/user/map/"+speciesToDisplay[Math.floor(Math.random()*speciesToDisplay.length)].SpeciesName)
    }

    useEffect(()=>{initializeMenu()},[]);
    return (
        <>
            {speciesToDisplay ? (
                    <div>
                        <Searchbar getSearchString={getSearchString} changeSearchString={changeSearchString}/>
                        <button onClick={navigateToRandomPage}>?</button>
                        <ul>
                            {speciesToDisplay.map((species,index)=>(
                                <li className={styles.cardTableItem} key={index}><Link to={linkPrefix+species.SpeciesName}><SpeciesCard species_name={species.SpeciesName} /></Link></li>
                            ))}
                        </ul>
                        {tags&&<TagFilterDropdown tags={tags} getTagFiltersMethod={getTagFilters} changeTagFiltersMethod={changeTagFilters}/>}
                    </div>
            ):(<p>loading</p>)}
        </>
    )
}

export default SpeciesTable;
