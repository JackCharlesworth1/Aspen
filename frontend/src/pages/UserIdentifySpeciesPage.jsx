import {useState,useEffect} from 'react'
import SpeciesList from '../components/SpeciesList.jsx'
import styles from '../css/UserIdentifySpeciesPage.module.css'

const UserIdentifySpeciesPage=()=>{

    const [subscribed,setSubscribed]=useState(false); 
    const [imageFile,setImageFile]=useState(null);
    const [menuData,setMenuData]=useState([]);
    const [speciesToDisplay,setSpeciesToDisplay]=useState([]);
    const [identificationCompleted,setIdentificationCompleted]=useState(false);
    const [requestMade,setRequestMade]=useState(false);
      
    const fetchAccountStatus=async ()=>{
        const token=localStorage.getItem("accessToken")
        const species_response=await fetch("https://api.theaspenproject.cloud/api/species",{headers:{"Content-Type":"application/json","Authorization":token}})
        if(!species_response.ok){
            console.log("Error fetching data about all of the species, so it will not be possible to find matches, response:",species_response)
        }
        const species_data=await species_response.json();
        setMenuData(species_data)
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

    const identifySpecies=async(event_)=>{
         event_.preventDefault()
         setRequestMade(true)
         const token=localStorage.getItem("accessToken")
         const image_form_data=new FormData();
         image_form_data.append('file',imageFile)
         const identification_response=await fetch("https://api.theaspenproject.cloud/api/external/identifySpecies",{method:'POST',headers:{"Authorization":token},body:image_form_data})

        if(!identification_response.ok){
            console.log("Error fetching the identification of the image, response:",identification_response)
        }
        const identification_data=await identification_response.json();
        if(!identification_data.annotations){
            console.log("Error Identifying Species- No Annotation in return data")
            return;
        }
        if(identification_data.annotations.length===0){
            console.log("Error Identifying Species- No matches were found") 
            return;
        }
        const full_annotation_string=identification_data.annotations[0].label;
        console.log("Full annotation string",full_annotation_string)
        const key_species_string=full_annotation_string.split(" ")[0]
        console.log("Split string into",key_species_string)

        const items_relevant_to_search=menuData.filter((species)=>species.SpeciesName.toLowerCase().includes(key_species_string.toLowerCase()));
        console.log("Displaying",items_relevant_to_search) 
        setSpeciesToDisplay(items_relevant_to_search)

        setIdentificationCompleted(true);
        setRequestMade(false);

        console.log("Got identification data",identification_data)

    }

    const resetIdentifyPage=()=>{
        setIdentificationCompleted(false);
        setImageFile(null);
        setSpeciesToDisplay([]);
    }

    useEffect(()=>{
            fetchAccountStatus()
    },[])

    return (
  <>
    {!identificationCompleted ? (
      <div>
        {requestMade && (
          <div>
            <h1>Attempting to identify a species we have information about in your image</h1>
          </div>
        )}

        {subscribed ? (
          <form className={styles.IdentificationDiv} onSubmit={identifySpecies}>
            <div
              className={imageFile ? styles.FileDropDivUploaded : styles.FileDropDiv}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const image_file = e.dataTransfer.files[0];
                setImageFile(image_file);
              }}
            >
              <p>Drag and drop to upload your image here</p>
            </div>

            <label className={imageFile ? styles.FileUploadButtonUploaded : styles.FileUploadButton} htmlFor="imageFileUploadButton">
              {imageFile ? "Uploaded" : "Pick A File To Upload"}
            </label>
            <input type="file" id="imageFileUploadButton" onChange={onImageFileUpload} accept="image/jpeg" style={{ display: "none" }} />
            <br />
            {imageFile && (
              <img className={styles.UploadedImage} src={URL.createObjectURL(imageFile)} />
            )}

            <br />

            {imageFile && (
              <input className={styles.DefaultButton} type="submit" value="Identify Species" />
            )}
          </form>
        ) : (
          <div className={styles.IdentificationDiv}>
            <p>
              You must be subscribed in order to use the feature that identifies
              species from a picture.
            </p>
          </div>
        )}
      </div>
    ) : (
      <div>
        {speciesToDisplay.length !== 0 ? (
          <div>
            <h1>Here are the species that your picture looks like</h1>
            <SpeciesList species_to_display={speciesToDisplay} />
            <button className={styles.DefaultButton} onClick={resetIdentifyPage}>
              Reset
            </button>
          </div>
        ) : (
                <div>
                    <h1>
              Unfortunately, we were not able to detect an animal in our
              database. You may want to try a new image, or try again later.
                    </h1>
                </div>
            )}
        </div>
        )}
    </>
    );

}

export default UserIdentifySpeciesPage;
