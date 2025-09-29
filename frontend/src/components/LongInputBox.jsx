import {useState} from 'react'
import styles from '../css/LongInputBox.module.css'

const LongInputBox=({inputPropertyName,inputValue,inputUpdater,placeholderText="",validationFunction=null,index=-1,textboxArray=null})=>{
    const [correctlyFormatted,setCorrectlyFormatted]=useState(true);
    const setNewInputValue=(_event,index)=>{
        _event.preventDefault();
        if(index!=-1&&textboxArray){
            const current_link_textboxes=[...textboxArray];
            current_link_textboxes[index]=_event.target.value
            inputUpdater(current_link_textboxes)

        }else{
            inputUpdater(_event.target.value);
        }
        if(validationFunction){
            setCorrectlyFormatted(validationFunction(_event.target.value));
        }
    } 
    const correctlyFormattedCSSOverride={
        color:'black'
    }
    const incorrectlyFormattedCSSOverride={
        color:'red'
    }

    return  (<div className={styles.LongInputDiv}>
                <label className={styles.LongInputBoxLabel} htmlFor={inputPropertyName}>{inputPropertyName}</label>
                <textarea rows="4" className={styles.LongInputBox} value={inputValue} onChange={(_event)=>setNewInputValue(_event,index)} name={inputPropertyName} placeholder={placeholderText} style={correctlyFormatted ? correctlyFormattedCSSOverride:incorrectlyFormattedCSSOverride}type="text" required />
            </div>)
}

export default LongInputBox
