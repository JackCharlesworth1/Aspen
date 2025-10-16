import {useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import ShortInputBox from '../components/ShortInputBox.jsx'
import LongInputBox from '../components/LongInputBox.jsx'
import SubmitButton from '../components/SubmitButton.jsx'
import styles from '../css/SpeciesForm.module.css'

const SpeciesForm=({formUse="add",species_name=""})=>{
    const navigate=useNavigate();
    const [speciesName,setSpeciesName]=useState("")
    const [speciesDescription,setSpeciesDescription]=useState("")
    const [linkTextboxValues,setLinkTextboxValues]=useState([""])
    const [linkDescriptionTextboxValues,setLinkDescriptionTextboxValues]=useState([""])
    const [linkTypes,setLinkTypes]=useState([""])
    const [imageFile,setImageFile]=useState(null);
    const [audioFile,setAudioFile]=useState(null);
    const [tagTextboxValues,setTagTextboxValues]=useState([])
    const [initialized,setInitialized]=useState(false);
    const [submittedForm,setSubmittedForm]=useState(false);

    const initalizeForm=async()=>{
        setAudioFile(null);
        if(species_name!=""){
            const species_data=await getSpecies(species_name)
            const fetchedImageFile=await getSpeciesFile("https://api.theaspenproject.cloud/api/static/images/",species_name.replace(" ","_").toLowerCase(),".jpg",true)
            const fetchedAudioFile=await getSpeciesFile("https://api.theaspenproject.cloud/api/static/audio/",species_name,".mp3",false)
            setImageFile(fetchedImageFile)
            setAudioFile(fetchedAudioFile)
            if(!(species_data instanceof Error)){
                setSpeciesName(species_data.SpeciesName)
                setSpeciesDescription(species_data.SpeciesDescription)
                if(species_data.SpeciesTags){
                    setTagTextboxValues(species_data.SpeciesTags)
                }
                if(species_data.SpeciesLinks){
                    setLinkTextboxValues(species_data.SpeciesLinks)
                }
            }
        }
        setInitialized(true);
    }

    const fillInFormValues=()=>{
        linkTypes.forEach((link_type,index)=>{
            if(link_type){
                const link_element=document.getElementById("relationship_type_dropdown_"+index);
                link_element.value=link_type;
            }
        })
    }

    const formSubmit=async(_event)=>{
        _event.preventDefault();
        setSubmittedForm(true);
        if(formUse==="add"){
            addSpecies();
        }else if(formUse=="update"){
            updateSpecies();
        }
    }

    const getSpecies=async(species_name)=>{
        try{
            const token=localStorage.getItem("accessToken")
            const result=await fetch("https://api.theaspenproject.cloud/api/species/"+species_name,{headers:{"Authorization":token}});
            if(result.ok){
                const data=await result.json()
                let link_data=null;
                let link_descriptions=[]
                let link_types=[]
                if(data){
                    for(let i=0;i<data.SpeciesLinks.length;i++){
                        link_data=await fetch("https://api.theaspenproject.cloud/api/species/links/"+species_name+"/"+data.SpeciesLinks[i],{headers:{"Authorization":token}})
                        if(!(link_data instanceof Error)){
                            try{
                                const link_object=await link_data.json()
                                if(link_object){
                                    link_descriptions.push(link_object.description)
                                    link_types.push(link_object.type||"")
                                }
                            }catch{
                                console.log("Error parsing data about the links of the species")
                                try{
                                    console.log("Came out with the json data",link_object)
                                }catch{
                                    console.log("...JSON Data is not able to be unpacked, formatting issue")
                                }
                            }
                        }
                    }
                    setLinkDescriptionTextboxValues(link_descriptions);
                    setLinkTypes(link_types)
                }
                return data;
            }else{
                console.log("Request to get species data was not successful",result.status,result.body)
                return navigate("/admin/request-error")

            }
        }catch{
            console.log("Error fetching species data to before updating"); 
            return navigate("/admin/request-error")

        }
    }
    const getSpeciesFile=async(endpoint,species_name,file_extention,critical)=>{
        try{
            const token=localStorage.getItem("accessToken")
            const result=await fetch(endpoint+species_name.toLowerCase()+file_extention,{headers:{"Authorization":token}});
            if(result.status!==404){
                return result.blob();
            }else{
                console.log("Request to get species data was not successful. Critical? ",critical)
                if(critical){
                    return navigate("/admin/request-error")
                }

            }
        }catch{
            console.log("Error fetching species data to before updating")
            return navigate("/admin/request-error")
        }
    }


    const submitNewInfo=async (endpoint,data)=>{
        try{
            const token=localStorage.getItem("accessToken")
            const result=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',"Authorization":token},body:data})
            if(result.ok){
                return navigate("/admin/dashboard")
            }
        }catch(error){
            console.log("Error submitting new species: request failed. "+error)
            return navigate("/admin/request-error")
        }

    }

    const addSpecies=async()=>{
        const links=[]
        for(let i=0;i<linkTextboxValues.length;i++){
            links.push(linkTextboxValues[i])
        }
        const newSpecies={
            SpeciesName:speciesName,
            SpeciesDescription:speciesDescription,
            SpeciesLinks:links,
            SpeciesTags:tagTextboxValues,
        }
        try{
            const token=localStorage.getItem("accessToken")
            const result=await fetch("https://api.theaspenproject.cloud/api/species/",{method:'POST',headers:{'Content-Type':'application/json',"Authorization":token},body:JSON.stringify(newSpecies)})

            if(result.ok){
                const imageFormData=new FormData();
                imageFormData.append('file',imageFile)
                const image_result=await fetch("https://api.theaspenproject.cloud/api/species/images/"+speciesName,{method:'POST',headers:{"Authorization":token},body:imageFormData})


                if(audioFile){
                    const audioFormData=new FormData();
                    audioFormData.append('file',audioFile)
                    const audio_result=await fetch("https://api.theaspenproject.cloud/api/species/audio/"+speciesName,{method:'POST',headers:{"Authorization":token},body:audioFormData})
                }

            }
            let description_result="";
            let newLink={};
            for(let i=0;i<linkTextboxValues.length;i++){
                const link_type_option_box=document.getElementById("relationship_type_dropdown_"+i);
                newLink={SpeciesOne:speciesName,SpeciesTwo:linkTextboxValues[i],
                         LinkDescription:linkDescriptionTextboxValues[i],LinkType:link_type_option_box.value}
                description_result=await fetch("https://api.theaspenproject.cloud/api/species/links/",{method:'POST',headers:{'Content-Type':'application/json',"Authorization":token},body:JSON.stringify(newLink)})
                if(!result.ok){
                    console.log("Error submitting new links: request failed")
                    return navigate("/admin/request-error")
                }
            }
            return navigate("/admin/dashboard")
        }catch(error){
            console.log("Error submitting new species: request failed. "+error)
            return navigate("/admin/request-error")
        }
    }

    const updateSpecies=async()=>{
        const links=[]
        for(let i=0;i<linkTextboxValues.length;i++){
            links.push(linkTextboxValues[i])
        }
        const newSpecies={
            SpeciesName:speciesName,
            SpeciesDescription:speciesDescription,
            SpeciesLinks:links,
            SpeciesTags:tagTextboxValues,
        }
        try{
            const token=localStorage.getItem("accessToken")
            const result=await fetch("https://api.theaspenproject.cloud/api/species/"+species_name,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':token},body:JSON.stringify(newSpecies)})
            if(result.ok){
                const imageFormData=new FormData();
                imageFormData.append('file',imageFile)
                const image_result=await fetch("https://api.theaspenproject.cloud/api/species/images/"+speciesName,{method:'POST',headers:{"Authorization":token},body:imageFormData})


                if(audioFile){
                    const audioFormData=new FormData();
                    audioFormData.append('file',audioFile)
                    const audio_result=await fetch("https://api.theaspenproject.cloud/api/species/audio/"+speciesName,{method:'POST',headers:{"Authorization":token},body:audioFormData})
                }

                for(let j=0;j<links.length;j++){
                    const link_type_select_object=document.getElementById("relationship_type_dropdown_"+j)
                    const link_description_object={LinkDescription:linkDescriptionTextboxValues[j],LinkType:link_type_select_object.value}
                    const description_result=await fetch("https://api.theaspenproject.cloud/api/species/links/"+species_name+"/"+linkTextboxValues[j],{method:'PUT',headers:{'Content-Type':'application/json',"Authorization":token},body:JSON.stringify(link_description_object)})
                }
                return navigate("/admin/dashboard")
            }
        }catch(error){
            console.log("Error updating species: request failed. "+error)
            return navigate("/admin/request-error")

        }
    }
    
    useEffect(()=>{
        initalizeForm();
    },[])
    
    useEffect(()=>{
        fillInFormValues();
    },[initialized])

    const renderSubmitButton=()=>{
        switch(formUse){
                case "add":
                    return (<SubmitButton buttonText="Add Species" />)
                    break;
                case "update":
                    return (<SubmitButton buttonText="Update Species" />)
                    break;
                default:
                    return (<SubmitButton buttonText="Submit" />)
                    break;
            }
    }

   const addInput=()=>{
       const current_link_textboxes=[...linkTextboxValues,""];
       setLinkTextboxValues(current_link_textboxes);
       
   }
   const removeInput=()=>{
       let current_link_textboxes=[...linkTextboxValues]
       current_link_textboxes=current_link_textboxes.slice(0,linkTextboxValues.length-1)
       setLinkTextboxValues(current_link_textboxes)
   }

   const addTag=()=>{
        let tag_textboxes_copy=[...tagTextboxValues,""];
        setTagTextboxValues(tag_textboxes_copy)
   }

   const removeTag=()=>{
        let tag_textboxes_copy=[...tagTextboxValues]
        tag_textboxes_copy=tag_textboxes_copy.slice(0,tagTextboxValues.length-1)
        setTagTextboxValues(tag_textboxes_copy)
   }

   const updateLinkTextboxValue=(_event,index)=>{
        const current_link_textboxes=[...linkTextboxValues];
        current_link_textboxes[index]=_event.target.value
        setLinkTextboxValues(current_link_textboxes)
   }

    const onImageFileUpload=(_event)=>{
        const selected_file=_event.target.files[0]
        setImageFile(selected_file)
    }
    const onAudioFileUpload=(_event)=>{
        const selected_file=_event.target.files[0];
        setAudioFile(selected_file)
    }
       

    return (
        submittedForm?<p>Submitting...</p>:(<form className={styles.SpeciesForm} onSubmit={formSubmit} >
            <div>
                <ShortInputBox inputPropertyName="Species Name" inputValue={speciesName} inputUpdater={setSpeciesName} placeholderText="E.g. Robin"/>
                <LongInputBox inputPropertyName="Species Description" inputValue={speciesDescription} inputUpdater={setSpeciesDescription}/>
                <div className={styles.TextInfoDiv}>
                    <div className={styles.LinkSelectorDiv}>
                        <label>Links</label>
                        <input className={styles.LinkChanger} type="button" value="-" onClick={removeInput}/>
                        <input className={styles.LinkChanger} type="button" value="+" onClick={addInput}/>
                    </div>
                    <div className={styles.Table}>
                    {linkTextboxValues.map((link_textbox_value,index)=>(
                        <div className={styles.TableRow}>
                            <div className={styles.TableItem}>
                                <div>
                                    <ShortInputBox inputPropertyName="Linked Species Name" key={index+100} inputValue={linkTextboxValues[index]} inputUpdater={setLinkTextboxValues} index={index} textboxArray={linkTextboxValues}/>
                                    <label style={{marginLeft:"20px"}}>Relationship Link Type</label>
                                    <br />
                                    <br style={{height:"20px"}}/>
                                    <select className={styles.RelationshipTypeDropdown} id={"relationship_type_dropdown_"+index} required>
                                        <option value=""> - </option>
                                        <option value="Foodchain">Foodchain</option>
                                        <option value="Evolution">Evolution</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.TableItem}>
                                <LongInputBox inputPropertyName="Species Link Description" key={index+200} inputValue={linkDescriptionTextboxValues[index]} inputUpdater={setLinkDescriptionTextboxValues} index={index} textboxArray={linkDescriptionTextboxValues}/>
                                <br />
                            </div>
                            <br />

                        </div>
                    ))}
                    </div>

                </div>
            </div>
            <div className={styles.StaticUploadDiv}>
                <div className={styles.TagSelectorDiv}>
                    <div>
                        <label>Tags</label>
                        <input className={styles.LinkChanger} type="button" value="-" onClick={removeTag}/>
                        <input className={styles.LinkChanger} type="button" value="+" onClick={addTag}/>
                    </div>
                    {tagTextboxValues.map((tag_textbox_value,index)=>(
                        <>
                            <ShortInputBox key={index+200} inputValue={tagTextboxValues[index]} inputUpdater={setTagTextboxValues} index={index} textboxArray={tagTextboxValues}/>
                            <div className={styles.NegativeSpacer} />
                        </>
                    ))}
                </div>

                <div className={imageFile? styles.FileDropDivUploaded:styles.FileDropDiv} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>{
                    e.preventDefault();
                    const image_file=e.dataTransfer.files[0];
                    setImageFile(image_file)
                }}>
                    <p>Drag and drop to upload your image via here</p>
                </div>
                    <label className={imageFile? styles.FileUploadButtonUploaded:styles.FileUploadButton} htmlFor="imageFileUploadButton">{imageFile? "Uploaded":"Pick A File To Upload"}</label>
                    <input type="file" id="imageFileUploadButton" onChange={onImageFileUpload} accept="image/jpeg" style={{display:'none'}}/>
                    <br />
                    {imageFile&&<img className={styles.UploadedImage} src={URL.createObjectURL(imageFile)}/>}  
                <div className={audioFile? styles.FileDropDivUploaded:styles.FileDropDiv} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>{
                    e.preventDefault();
                    const audio_file=e.dataTransfer.files[0];
                    setAudioFile(audio_file)
                }}>
                    <p>Drag and drop to upload your audio via here</p>
                </div>
                    <label className={audioFile? styles.FileUploadButtonUploaded:styles.FileUploadButton} htmlFor="audioFileUploadButton">{audioFile? "Uploaded":"Pick A File To Upload"}</label>
                    <input type="file" id="audioFileUploadButton" onChange={onAudioFileUpload} accept="audio/*" style={{display:'none'}}/>
                    <br />
            {(audioFile&&(<audio controls>
                        <source src={URL.createObjectURL(audioFile)} />
                    </audio>))}

                {renderSubmitButton()}
            </div>
         </form>)
    )
}
export default SpeciesForm;
