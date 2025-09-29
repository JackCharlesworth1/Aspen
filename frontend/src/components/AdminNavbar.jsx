import {Link} from 'react-router-dom'
import NavButton from './NavButton.jsx'
import styles from '../css/AdminNavbar.module.css'

const AdminNavbar=()=>{
    return (<nav className={styles.AdminNavbar}>
            <h3 className={styles.NavTitle}>Admin Panel</h3>
            
            <NavButton destination="/admin/dashboard">Dashboard</NavButton>
            <NavButton destination="/admin/add-species">Add Species</NavButton>
            <NavButton destination="/admin/update-species">Update Species</NavButton>

            </nav>)
}

export default AdminNavbar;
