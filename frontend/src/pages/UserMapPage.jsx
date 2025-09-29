import SpeciesInfoCard from '../components/SpeciesInfoCard.jsx'
import SpeciesMap from '../components/SpeciesMap.jsx'
import {useParams} from 'react-router-dom'
import styles from '../css/SpeciesMapPage.module.css'

const UserMapPage=()=>{
    const {species_name}=useParams();
    return(
        <div className={styles.PageContainer}>
            <SpeciesMap species_name={species_name}/>
            <SpeciesInfoCard species_name={species_name} />
        </div>
    )
}
export default UserMapPage
