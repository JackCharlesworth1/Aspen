import styles from '../css/SubmitButton.module.css'

const SubmitButton=({buttonText})=>{
    return (
        <input className={styles.SubmitButton} type="submit" value={buttonText}></input>
    ) 
}
export default SubmitButton;
