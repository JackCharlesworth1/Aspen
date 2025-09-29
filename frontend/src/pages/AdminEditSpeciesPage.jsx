import {useParams} from 'react-router-dom'
import SpeciesForm from '../components/SpeciesForm.jsx'
import DeleteButton from '../components/DeleteButton.jsx'
import styles from '../css/AdminUpdateSpeciesPage.module.css'

const AdminUpdateSpeciesPage=()=>{
    const {name}=useParams();
    return (
        <div className={styles.EditForm}>
            <SpeciesForm formUse="update" species_name={name}/>
            <DeleteButton species_name={name}/>
        </div>
    )
}
export default AdminUpdateSpeciesPage
