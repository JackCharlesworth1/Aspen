import {useState,useEffect} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faReply} from '@fortawesome/free-solid-svg-icons';
import styles from '../css/LinkDescription.module.css'

const LinkDescription=({species_name,linked_species,closeLinkPage})=>{
    const [linkDescription,setLinkDescription]=useState(null);
    const [linkType,setLinkType]=useState(null);

    const fetchLinkInformation=async()=>{
        const token=localStorage.getItem("accessToken")
        const description_result=await fetch("https://api.theaspenproject.cloud/api/species/links/"+species_name+"/"+linked_species,{headers:{"Authorization":token}});
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
                <button className={styles.ReturnButton} onClick={closeLinkPage} ><FontAwesomeIcon icon={faReply} /></button>
                {linkDescription&&linkType&&linked_species&&species_name&&(<>
                    <div className={styles.linkedImagesContainer}>
                        <img className={styles.linkedImage} src={"https://api.theaspenproject.cloud/api/static/images/"+species_name.toLowerCase()+".jpg"} />
                        <img className={styles.linkedImage} src={"https://api.theaspenproject.cloud/api/static/images/"+linked_species.toLowerCase()+".jpg"} />
                    </div>
                    <h1 className={styles.LinkTitle}>{species_name} & {linked_species}</h1>
                    <h3 className={styles.LinkType}>{linkType} link</h3>
                    <p className={styles.LinkContent}>{linkDescription}</p>
                </>)}
            </div>)
}
export default LinkDescription;
