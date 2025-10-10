import styles from '../css/AdminPanelLayout.module.css'
import {Outlet} from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar.jsx'
import AdminFooter from '../components/AdminFooter.jsx'

const AdminPanelLayout=()=>{
    return (
        <div className={styles.AdminLayoutContainer}>
            <AdminNavbar />
            <Outlet />
            <AdminFooter />
        </div>
    )
}

export default AdminPanelLayout;
