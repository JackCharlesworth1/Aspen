import {useState,useEffect} from 'react'
import styles from '../css/UserIdentifySpeciesPage.module.css'

const UserIdentifySpeciesPage=()=>{

    const [subscribed,setSubscribed]=useState(false); 
    const [imageFile,setImageFile]=useState(null);
      
    const fetchAccountStatus=async ()=>{
        const token=localStorage.getItem("accessToken")
        const percieved_username=localStorage.getItem("client_percieved_username")
        const account_response=await fetch("https://api.theaspenproject.cloud/api/account/info/"+percieved_username,{headers:{"Content-Type":"application/json","Authorization":token}});
        if(!account_response.ok){
            console.log("Error fetching account details to verify subscription status, response:",account_response)
        }
        const account_data=await account_response.json();
        if(account_data.subscribed){
            setSubscribed(true)
        }
    }

    const onImageFileUpload=(_event)=>{
        const selected_file=_event.target.files[0]
        setImageFile(selected_file)
    }

    const identifySpecies=async()=>{
         const token=localStorage.getItem("accessToken")
         const image_form_data=new FormData();
         imageFormData.append('file',imageFile)
         const image_result=await fetch("https://api.theaspenproject.cloud/api/external/identifySpecies/",{method:'POST',headers:{"Authorization":token},body:image_form_data})

        if(!identification_response.ok){
            console.log("Error fetching the identification of the image, response:",identification_response)
        }
        const identification_data=await identification_response.json();
        console.log("Got identification data",identification_data)
    }

    useEffect(()=>{
            fetchAccountStatus()
    },[])

    return (
        <div>
            {subscribed?<form styles={styles.IdentificationDiv} onSubmit={identifySpecies}>
                <div className={imageFile? styles.FileDropDivUploaded:styles.FileDropDiv} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>{
                        e.preventDefault();
                        const image_file=e.dataTransfer.files[0];
                        setImageFile(image_file)
                    }}>
                    <p>Drag and drop to upload your image via here</p>
                </div>
                    <label className={imageFile? styles.FileUploadButtonUploaded:styles.FileUploadButton} htmlFor="imageFileUploadButton">{imageFile? "Uploaded":"Pick A File To Upload"}</label>
                    <input type="file" id="imageFileUploadButton" onChange={onImageFileUpload} accept="image/jpeg" style={{display:'none'}} />
                    <br />
                    {imageFile&&<img className={styles.UploadedImage} src={URL.createObjectURL(imageFile)}/>}  
                    {imageFile&&<input type="submit" value="Identify Species" />} 
                    
                    </form>:<div styles={styles.IdentificationDiv}>

                        <p>You have to subscribed in order to use the feature that allows you to identify species from a picture</p>

                    </div>} 
        </div>        
    )
}
export default UserIdentifySpeciesPage;
