import {useNavigate} from 'react-router-dom'
import styles from '../css/LandingPage.module.css'

const LandingPage=()=>{
    const navigate=useNavigate();
    const callToAction=()=>{
        navigate("/user/account-method")
    }

    return <div className={styles.PageContainer}>
                <div className={styles.LandingDiv}>
                    <h1 className={styles.LandingInfo}>Learn About Living Things</h1>
                    <p className={styles.LandingInfo}>
                        Breathe nature back into your life. Don't just learn classifications, learn what things do and how species interact.
                    </p>
                    <button onClick={callToAction} className={styles.CallToActionButton}>What you can do</button>
                </div>
            </div>
}
export default LandingPage;
