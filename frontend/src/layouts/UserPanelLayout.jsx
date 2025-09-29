import {Outlet} from 'react-router-dom'
import UserNavbar from '../components/UserNavbar.jsx'
import UserFooter from '../components/UserFooter.jsx'

const UserPanelLayout=()=>{
    return (
        <>
            <UserNavbar />
            <Outlet />
            <UserFooter />
        </>
    )
}

export default UserPanelLayout;
