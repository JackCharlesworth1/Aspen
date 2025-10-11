import {useNavigate} from 'react-router-dom'
import styles from '../css/DeleteButton.module.css'

const DeleteButton=({species_name})=>{
    const navigate=useNavigate();
    const name=species_name
    const deleteSpecies=async()=>{
        const token=localStorage.getItem("accessToken")
        try{
            const result=await fetch("https://api.theaspenproject.cloud/api/species/"+species_name,{method:'DELETE',headers:{'Content-Type':'application/json','Authorization':token}})
            if(result.ok){
                return navigate("/admin/dashboard")
            }
        }catch(error){
            throw new Error("Error submitting new species: request failed. "+error)
        }
    }

    return (<button className={styles.DeleteButton} onClick={deleteSpecies}>DELETE</button>)
}

export default DeleteButton;
