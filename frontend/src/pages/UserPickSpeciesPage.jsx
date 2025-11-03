import {useNavigate} from 'react-router-dom'
import SpeciesTable from '../components/SpeciesTable.jsx'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import styles from '../css/SpeciesTable.module.css'

const UserPickSpeciesPage=()=>{
    const navigate=useNavigate();

    const navigateToAccountPage=()=>{
        navigate("/account");
    }

    return (
            <>
                <button style={{position:"absolute",marginLeft:"5px"}} className={styles.RandomButton} title="Go to account screen" onClick={navigateToAccountPage}>
                        <FontAwesomeIcon icon={faUser} />
                </button>
                <SpeciesTable linkPrefix="/user/map/"/>
            </>
    )
}
export default UserPickSpeciesPage;
