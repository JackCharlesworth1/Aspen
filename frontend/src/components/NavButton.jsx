import {NavLink} from 'react-router-dom'
import classNames from 'classnames';
import styles from '../css/NavButton.module.css'

const NavButton=({children,destination,style_overrides})=>{
    
    const activeCSS=styles.ActiveNavButton;
    const inactiveCSS=styles.InactiveNavButton;

    const decidedStyle=({isActive}) => isActive ? activeCSS:inactiveCSS

    return (
        <NavLink className={decidedStyle} to={destination} style={style_overrides}>
            {children}
        </NavLink>
    )
}

export default NavButton;
