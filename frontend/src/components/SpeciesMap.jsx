import {useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {faReply} from '@fortawesome/free-solid-svg-icons';
import SpeciesCard from './SpeciesCard.jsx'
import LinkDescription from './LinkDescription.jsx'
import {getLinkedSpecies,getLinkSkeletons,LinkCanvas} from './SpeciesLinks.jsx'
import styles from '../css/SpeciesMap.module.css'

const SpeciesMap=({species_name})=>{
        const navigate=useNavigate()
        const speciesName=species_name;
        const [speciesInfo,setSpeciesInfo]=useState(null) 
        const [speciesLinkTypes,setSpeciesLinkTypes]=useState([]);
        const [page,setPage]=useState(0);
        const [linksToDisplay,setLinksToDisplay]=useState([]);
        const [linkSelected,setLinkSelected]=useState(null);

        const fetchSpeciesData=async()=>{
            try{
                const token=localStorage.getItem("accessToken")
                const res=await fetch("/api/species/"+speciesName,{headers:{"Authorization":token}})
                if(!res.ok){
                    console.log("Error, fetching data on species failed (bad request): ")
                    return navigate("/user/request-error")
                }
                const data=await res.json()
                setSpeciesInfo(data)
                if(data){
                    if(data.SpeciesLinks){
                        const species_link_types_copy=[];
                        const fetch_promises=data.SpeciesLinks.map((link)=>fetch("/api/species/links/"+data.SpeciesName+"/"+link,{headers:{"Authorization":token}}))
                        const all_responses=await Promise.all(fetch_promises)
                        const all_json_promises=all_responses.map((link_res)=>{
                            if(!link_res.ok){
                                console.log("Error fetching data on species links failed (bad request)")
                                return navigate("/user/request-error")
                            }else{
                                return link_res.json()
                            }
                        })
                        const json_data_items=await Promise.all(all_json_promises)
                        json_data_items.forEach((data)=>{
                            if(data.type){
                                species_link_types_copy.push(data.type)
                            }else{
                                console.log("Error getting the relation type data from the json")
                                return navigate("/user/request-error")
                            }
                        })
                        setSpeciesLinkTypes(species_link_types_copy)
                        determineCandidatePages(species_link_types_copy,data);
                    }
                }
            }catch(error){
                console.log("Error fetching data on species: "+error)
                return navigate("/user/request-error")
            }
        }

        useEffect(()=>{
                setPage(0);
                setLinkSelected(null);
                fetchSpeciesData()
        },[speciesName])

        const previousPage=()=>{
            ((page>0) && setPage(page-1))
        }
        const nextPage=()=>{
            if(speciesInfo){
                    if(speciesInfo.SpeciesLinks){
                        (page<Math.floor(speciesInfo.SpeciesLinks.length/4) && setPage(page+1))
                    }
            }
        }

        const determineCandidatePages=(species_link_types,species_info)=>{
            const relation_dropdown_object=document.getElementById("relation_type_dropdown")
            const relation_to_filter_to=relation_dropdown_object.value;
            let links_to_display=[]
            species_link_types.map((link_type,index)=>{
                if(link_type===relation_to_filter_to){
                    links_to_display.push(species_info.SpeciesLinks[index])
                }
            })
            setLinksToDisplay(links_to_display)
        }

        const getPageUI=()=>{
            if(speciesInfo){
                if(linksToDisplay){
                    if(linksToDisplay.length>4){
                        return (<div>
                            <p>On page {page+1} of {Math.ceil(linksToDisplay.length/4)}</p>
                            <div className={styles.PageControlSection}>
                            <button className={styles.PageButton} onClick={previousPage}>{"<"}</button>
                            <button className={styles.PageButton} onClick={nextPage}>{">"}</button>
                            </div>
                        </div>)
                    }
                }
            }
        }

        const navigateToSpeciesSelection=()=>{
            navigate("/user/pick-species")
        }

        const linkClickedHandler=(event_,index)=>{
            event_.preventDefault() 
            setLinkSelected(index);
        }

        const closeLinkInfo=()=>{
            setLinkSelected(null);
        }

        return(
            <div className={styles.PageContainer}>
                {linkSelected!=null&&(<div className={styles.LinkDescriptionBox}>
                        <LinkDescription species_name={speciesName} linked_species={linksToDisplay[(4*page)+linkSelected]} closeLinkPage={closeLinkInfo} />
                </div>)}
                <div>
                    <select className={styles.RelationDropdown} id="relation_type_dropdown" onChange={(event_)=>determineCandidatePages(speciesLinkTypes,speciesInfo)}>
                        <option value="Foodchain" selected >Foodchain</option>
                        <option value="Evolution" >Evolution</option>
                    </select>
                </div>
                <button className={styles.ReturnButton} title="Go back to pick a different species from search menu" onClick={navigateToSpeciesSelection}>
                    <>
                        <FontAwesomeIcon icon={faReply} />
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </>
                </button>

                {speciesInfo&&<LinkCanvas links={linksToDisplay} page={page} />}


                <div className={styles.mainItem}>
                    <SpeciesCard species_name={speciesName} />
                    {getPageUI()}
                </div>
                {speciesInfo ? getLinkedSpecies(linksToDisplay,page,linkClickedHandler):getLinkSkeletons()}
            </div>
        )

}
export default SpeciesMap;
