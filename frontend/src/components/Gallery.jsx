import {useState} from 'react'
import styles from '../css/Gallery.module.css'

const Gallery=({imageData})=>{
    const [overlayState,setOverlayState]=useState(false);
    const [expandedImageData,setExpandedImageData]=useState(null)
    const [expandedImageIndex,setExpandedImageIndex]=useState(-1);

    const disableOverlay=()=>{
        setOverlayState(false);
    }

    const expandImage=(event_,index)=>{
        event_.preventDefault();
        setExpandedImageData(imageData[index]);
        setExpandedImageIndex(index);
        setOverlayState(true);
    }


    const previousSighting=()=>{
        const new_index=expandedImageIndex-1;
        setExpandedImageIndex(new_index);
        setExpandedImageData(imageData[new_index])
    }
    const nextSighting=()=>{
        const new_index=expandedImageIndex+1;
        setExpandedImageIndex(new_index);
        setExpandedImageData(imageData[new_index])
    }

    return (<div>
                {imageData.length>0&&<div className={styles.gallery_container}>
                    {imageData.map((image_data,index)=>
                        (<div className={styles.shrinking_div} onClick={(event_)=>{expandImage(event_,index)}}>
                                {typeof image_data==='string'?<img className={styles.gallery_item} src={image_data} /> : <img className={styles.gallery_item} src={URL.createObjectURL(image_data)} />}
                        </div>)
                    )}
                </div>}

                {overlayState&&expandedImageData&&(<div className={styles.overlay_fill_container}>
                    <div className={styles.overlay_fill_tint}></div>
                    <input type="button" className={styles.exit_button} onClick={disableOverlay} value="X"/>
                    {expandedImageIndex!==0&&<input type="button" className={styles.previous_image_button} onClick={previousSighting} value="<"/>}
                    {expandedImageIndex!==(imageData.length-1)&&<input type="button" className={styles.next_image_button} onClick={nextSighting} value=">"/>}
                    <img className={styles.overlay_image} src={typeof expandedImageData==='string'?expandedImageData:URL.createObjectURL(expandedImageData)} />
                </div>)}
            </div>)
}

export default Gallery;
