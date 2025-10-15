import {useState,useEffect} from 'react';
import Gallery from './Gallery.jsx'
import styles from '../css/Sightings.module.css'

const Sightings=({username,speciesName})=>{
    const [imageFile,setImageFile]=useState(null);
    const [galleryData,setGalleryData]=useState([]);

    const onFileUpload=(_event)=>{
        const selected_file=_event.target.files[0]
        setImageFile(selected_file)
    }
 
    const submitSightings=async (_event)=>{
        _event.preventDefault() 
        const image_form_data=new FormData();
        image_form_data.append("file",imageFile)
        const image_result=await fetch("https://api.theaspenproject.cloud/api/user/sightings/"+username+"/"+speciesName,{method:'POST',body:image_form_data})
        if(image_result){
            const updated_gallery_files=[...galleryData,imageFile]
            setGalleryData(updated_gallery_files) 
            setImageFile(null);
        }
    }

    const fetchGalleryData=async ()=>{
        console.log("CALLED GET SIGHTINGS FUNCTION")
        const gallery_response=await fetch("/api/user/sighting-count/"+username+"/"+speciesName)
        const result=await gallery_response.json()
        const number_of_sightings=parseInt(result.sightings)
        console.log("SIGHTINGS RESULT:",result)
        let sightings=[];
        for(let i=0;i<number_of_sightings;i++){
            sightings.push("https://api.theaspenproject.cloud/api/static/user/"+username.toLowerCase().replace(" ","_")+"/images/"+speciesName.toLowerCase().replace(" ","_")+"/"+i+".jpg")
        }
        console.log("SIGHTINGS FINAL:",sightings)
        setGalleryData(sightings)
    };

    useEffect(()=>{
        setImageFile(null);
        fetchGalleryData();
    },[speciesName,username])

    return (
        <form style={{width:"50%",minWidth:"400px"}} onSubmit={submitSightings}>
        <div className={styles.SightingsContainer}>
            <div className={imageFile? styles.FileDropDivUploaded:styles.FileDropDiv} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>{
                    e.preventDefault();
                    const image_file=e.dataTransfer.files[0];
                    setImageFile(image_file)
                }}>
                    <p>Drag and drop to upload your sighting here</p>
            </div>
            <div className={styles.UploadingDiv}> 
                <label className={imageFile? styles.FileUploadButtonUploaded:styles.FileUploadButton} htmlFor="fileUploadButton">{imageFile? "Uploaded":"Click To Pick Photo"}</label>
                <input type="file" id="fileUploadButton" onChange={onFileUpload} accept="image/jpeg" style={{display:'none'}}/>
                <br />
                {imageFile&&<img className={styles.UploadedImage} src={URL.createObjectURL(imageFile)}/>}  
                <br />
                <button className={styles.SubmitSightingsButton}>Save Sighting</button>
            </div>
            {galleryData&&<Gallery imageData={galleryData}/>}
        </div>
        </form>
    )
}

export default Sightings;
