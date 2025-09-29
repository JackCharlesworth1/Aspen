import {NavLink} from 'react-router-dom'
import styles from '../css/NavButton.module.css'

const NavButton=({children,destination})=>{
    
    const activeCSS={color:'red'}
    const inactiveCSS={color:'black'}

    const decideStyle=({isActive}) => isActive ? activeCSS:inactiveCSS

    return (
        <NavLink className={styles.NavButton} style={decideStyle} to={destination}>
            {children}
        </NavLink>
    )
}

export default NavButton;
