import {Outlet} from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar.jsx'
import AdminFooter from '../components/AdminFooter.jsx'

const AdminPanelLayout=()=>{
    return (
        <>
            <AdminNavbar />
            <Outlet />
            <AdminFooter />
        </>
    )
}

export default AdminPanelLayout;
