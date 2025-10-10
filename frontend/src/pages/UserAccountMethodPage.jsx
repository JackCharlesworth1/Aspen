import NavButton from '../components/NavButton.jsx'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import styles from '../css/UserAccountMethodPage.module.css'

const UserAccountMethodPage=()=>{

    return (<div className={styles.PageContainer}>
                <div className={styles.CentralDiv}>
                    <NavButton className={styles.AccountMethodButton}destination="/user/login">
                        <>Login <FontAwesomeIcon icon={faArrowRight} /></>
                    </NavButton>
                    <div style={{height:"30px"}}/>
                    <NavButton destination="/user/register">
                        <><FontAwesomeIcon icon={faArrowLeft} /> Register</>
                    </NavButton>
                </div>
            </div>)
}
export default UserAccountMethodPage;
