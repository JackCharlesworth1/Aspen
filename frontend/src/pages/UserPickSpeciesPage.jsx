import {useNavigate} from 'react-router-dom'
import SpeciesTable from '../components/SpeciesTable.jsx'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {faCamera} from '@fortawesome/free-solid-svg-icons';
import styles from '../css/SpeciesTable.module.css'

const UserPickSpeciesPage=()=>{
    const navigate=useNavigate();

    const navigateToAccountPage=()=>{
        navigate("/account");
    }

    const navigateToCamera=()=>{
        navigate("/user/identify")
    }

    return (
            <>
                <button style={{position:"absolute",marginLeft:"5px"}} className={styles.RandomButton} title="Go to account screen" onClick={navigateToAccountPage}>
                        <FontAwesomeIcon icon={faUser} />
                </button>
                <button style={{position:"absolute",marginLeft:"46px"}} className={styles.RandomButton} title="Identify species from photo" onClick={navigateToCamera}>
                    <>
                        <FontAwesomeIcon icon={faCamera} />
                    </>
                </button>
                <SpeciesTable linkPrefix="/user/map/"/>
            </>
    )
}
export default UserPickSpeciesPage;
