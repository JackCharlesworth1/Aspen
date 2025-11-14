import {useState,useEffect} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSliders} from '@fortawesome/free-solid-svg-icons';
import SpeciesCard from './SpeciesCard.jsx'
import TagFilterDropdown from './TagFilterDropdown.jsx'
import Searchbar from './Searchbar.jsx'
import styles from '../css/SpeciesTable.module.css'

const SpeciesList=({species_to_display})=>{
    const navigate=useNavigate()
    const [speciesToDisplay,setSpeciesToDisplay]=useState([])


    useEffect(()=>{setSpeciesToDisplay(species_to_display)},[]);
    return (
        <>
            {speciesToDisplay ? (
                    <div className={styles.SpeciesTableContainer}>
                        <ul className={styles.SpeciesTable}>
                            {speciesToDisplay.map((species,index)=>(
                                <li className={styles.cardTableItem} key={index}><Link className={styles.CardLink} to={linkPrefix+species.SpeciesName}><SpeciesCard species_name={species.SpeciesName} scientific_name={species.ScientificName}tabled={true} active={!tagFiltersShown} /></Link></li>
                            ))}
                        </ul>

                    </div>
            ):(<p>loading</p>)}
        </>
    )
}

export default SpeciesList;
