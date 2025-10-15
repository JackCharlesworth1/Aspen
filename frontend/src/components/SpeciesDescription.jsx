import {useState,useEffect} from 'react'
import styles from '../css/SpeciesDescription.module.css'

const SpeciesDescription=({description})=>{
    const [dropdownTextStates,setDropdownTextStates]=useState([])

    const parseDescription=(input)=>{
        if(!input.includes("<")){
            return [{"Description":input}];
        }
        let parsed_description=[]
        const split_input=input.split("<",2)

        const default_description=split_input[0]
        parsed_description.push({"Description":default_description})
        let current_section=input.slice(default_description.length+1)
        while(true){
            const current_section_split=current_section.split(">",2)
            const first_field=current_section_split[0]
            const content_section=current_section.slice(first_field.length+1)
            const content_section_split=content_section.split("<",2)
            if(content_section_split.length===1){
                parsed_description.push({[first_field]:content_section_split[0]})
                break;
            }else{
                const first_field_content=content_section_split[0]
                current_section=content_section.slice(first_field_content.length+1)
                parsed_description.push({[first_field]:first_field_content})
            }
        }
        return parsed_description;
        
    }

    const renderDescription=(parsed_description)=>{
        if(!dropdownTextStates){
            return
        }
        const jsx_elements=[];
        let expandable_section_index=0;
        for(let i=0;i<parsed_description.length;i++){
            const item=parsed_description[i]
            const [field_name,field_content]=Object.entries(item)[0];
            switch(field_name){
                case "Description":
                    jsx_elements.push(<p className={styles.Description}>{field_content}</p>)
                    break;
                case "SubsectionTitle":
                    const expandable_section_index_copy=expandable_section_index;
                    const button_custom_function=(_event)=>onExpandableSectionButtonClick(_event,expandable_section_index_copy)
                    const dropdown_button=<button className={styles.SubsectionTitle} key={`button-${expandable_section_index}`} onClick={(_event)=>button_custom_function(_event)}>{field_content}</button>
                    jsx_elements.push(dropdown_button)
                    break;
                case "SubsectionDescription":
                    jsx_elements.push(<p className={styles.SubsectionDescription}>{dropdownTextStates[expandable_section_index]&&field_content}</p>)
                    expandable_section_index=expandable_section_index+1;
                    break;
                case "ReferalLink":
                    const button_text=field_content.split(":")[0]
                    const link=field_content.slice(button_text.length+1)
                    jsx_elements.push(<a className={styles.EmbededHyperlink} href={link}>{button_text}</a>)
                    break;
            }
        }
        return <div>{jsx_elements}</div>;
        
    }

    const onExpandableSectionButtonClick=(_event,index)=>{
        _event.preventDefault();
        const button_states_copy=[...dropdownTextStates];
        button_states_copy[index]=!button_states_copy[index];
        setDropdownTextStates(button_states_copy);
    }
       
    const initializeDropdownValues=(description)=>{
        const parsed_description=parseDescription(description)
        const number_of_dropdowns=parsed_description.filter((item)=>Object.entries(item).some(([key,value])=>key==="SubsectionTitle")).length;
        const dropdown_states_local=new Array(number_of_dropdowns).fill(true);
        setDropdownTextStates(dropdown_states_local)
    }

    useEffect(()=>{
        initializeDropdownValues(description);
    },[description])

    return(
        <div>
            {renderDescription(parseDescription(description))}
        </div>
    ) 
}
export default SpeciesDescription
