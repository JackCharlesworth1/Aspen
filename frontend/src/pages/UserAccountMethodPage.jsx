import NavButton from '../components/NavButton.jsx'
import styles from '../css/UserAccountMethodPage.module.css'

const UserAccountMethodPage=()=>{

    return (<div className={styles.PageContainer}>
                <div className={styles.CentralDiv}>
                    <NavButton className={styles.AccountMethodButton}destination="/user/login">Login</NavButton>
                    <NavButton destination="/user/register">Register</NavButton>
                </div>
            </div>)
}
export default UserAccountMethodPage;
