import {useState,useEffect} from 'react'
import styles from '../css/LinkDescription.module.css'

const LinkDescription=({species_name,linked_species,closeLinkPage})=>{
    const [linkDescription,setLinkDescription]=useState(null);
    const [linkType,setLinkType]=useState(null);

    const fetchLinkInformation=async()=>{
        const token=localStorage.getItem("accessToken")
        const description_result=await fetch("/api/species/links/"+species_name+"/"+linked_species,{headers:{"Authorization":token}});
        if(description_result.status===200){
            const description_data=await description_result.json();
            setLinkDescription(description_data.description)
            setLinkType(description_data.type)
        }
    }

    useEffect(()=>{
        fetchLinkInformation();
    },[linked_species])

    return (<div>
                <input type="button" value="Back" onClick={closeLinkPage}/>
                {linkDescription&&linkType&&linked_species&&species_name&&(<>
                    <div className={styles.linkedImagesContainer}>
                        <img className={styles.linkedImage} src={"/api/static/images/"+species_name.toLowerCase()+".jpg"} />
                        <img className={styles.linkedImage} src={"/api/static/images/"+linked_species.toLowerCase()+".jpg"} />
                    </div>
                    <h2>{species_name} & {linked_species}</h2>
                    <h4>{linkType} link</h4>
                    <p>{linkDescription}</p>
                </>)}
            </div>)
}
export default LinkDescription;
