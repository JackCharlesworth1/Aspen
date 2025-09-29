import {Outlet} from 'react-router-dom'
import LandingNavbar from '../components/LandingNavbar.jsx'
import LandingFooter from '../components/LandingFooter.jsx'

const LandingPanelLayout=()=>{
    return (
        <>
            <LandingNavbar />
            <Outlet />
            <LandingFooter />
        </>
    )
}

export default LandingPanelLayout;
