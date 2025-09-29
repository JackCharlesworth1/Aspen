import {Link} from 'react-router-dom'
import NavButton from './NavButton.jsx'
import styles from '../css/LandingNavbar.module.css'

const AdminNavbar=()=>{
    return (<nav className={styles.LandingNavbar}>
            <h3 className={styles.LandingTitle}>Aspen</h3>
            
            <NavButton destination="/user/account-method">Get Started</NavButton>

            </nav>)
}

export default AdminNavbar;
