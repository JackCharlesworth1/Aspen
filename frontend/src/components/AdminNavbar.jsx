import {Link} from 'react-router-dom'
import NavButton from './NavButton.jsx'
import styles from '../css/AdminNavbar.module.css'

const AdminNavbar=()=>{
    return (<nav className={styles.AdminNavbar}>
            <h3 className={styles.NavTitle}>Admin Panel</h3>
            
            <NavButton destination="/admin/dashboard" style_overrides={{'--highlight-color':'#FF0'}}>Dashboard</NavButton>
            <NavButton destination="/admin/add-species" style_overrides={{'--highlight-color':'#0F0'}}>Add Species</NavButton>
            <NavButton destination="/admin/update-species" style_overrides={{'--highlight-color':'#0FF'}}>Update Species</NavButton>

            </nav>)
}

export default AdminNavbar;
