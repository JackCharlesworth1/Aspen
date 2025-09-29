import {Link} from 'react-router-dom'
import {useEffect,useRef} from 'react'
import SpeciesCard from './SpeciesCard.jsx'
import styles from '../css/SpeciesMap.module.css'
import classNames from 'classnames'

const getLinkedSpecies=(links,page,linkClickedHandler)=>{
    if(links){
        const number_of_links_to_display=Math.min(4,links.length-(page*4))
        const links_to_display=links.slice(4*page,4*page+number_of_links_to_display)
        const uniques_styles=[{color:'red'},{color:'green'},{color:'blue'},{color:'yellow'}]
        let returning_elements=[]
        for(let i=0;i<links_to_display.length;i++){
            returning_elements.push(<div>
                                        <div className={classNames(styles.LinkCard,styles["LinkCard"+(i+1).toString()])}><Link to={"/user/map/"+links_to_display[i]} key={i}>
                                            <SpeciesCard species_name={links_to_display[i]} />
                                            </Link>
                                        </div>
                                        <div onClick={(event_)=>{linkClickedHandler(event_,i)}} className={classNames(styles.LinkClickArea,styles["LinkClickArea"+(i+1).toString()])}>
                                             
                                        </div> 
                                    </div>)
        }
        return returning_elements;
    }else{
        return []
    }
}
        
const getLinkSkeletons=()=>{
    return(
           <p>Getting info...</p>
          )
}

const LinkCanvas=({links,page})=>{
    const canvas_container=useRef(null);

    const drawLine=(context,x1,y1,x2,y2)=>{
        context.beginPath();
        context.moveTo(x1,y1)
        context.lineTo(x2,y2)
        context.stroke();
    }

    useEffect(()=>{
        const number_of_links_to_display=Math.min(4,links.length-(page*4))
        const canvas = document.createElement("canvas");
        const context=canvas.getContext("2d");

        canvas.className=styles.LinkCanvas
        canvas.width=window.innerWidth/2;
        canvas.height=window.innerHeight;
        canvas.style.pointerEvents='none';
        canvas.style.zIndex='0'

        const margin_proportion=0.23;    
        const y_offset=-canvas.height*0.035;

        const canvas_lines=[[canvas.width*(margin_proportion),canvas.width*(margin_proportion),canvas.width/2,canvas.height/2+y_offset],
                            [canvas.width*(1-margin_proportion),canvas.width*(margin_proportion),canvas.width/2,canvas.height/2+y_offset],
                            [canvas.width*(margin_proportion),canvas.width*(1-margin_proportion),canvas.width/2,canvas.height/2+y_offset],
                            [canvas.width*(1-margin_proportion),canvas.width*(1-margin_proportion),canvas.width/2,canvas.height/2+y_offset]];

        for(let i=0;i<number_of_links_to_display;i++){
            drawLine(context,canvas_lines[i][0],canvas_lines[i][1]+y_offset,canvas_lines[i][2],canvas_lines[i][3]+y_offset)
        }

        if(canvas_container.current){
            canvas_container.current.innerHTML='';
            canvas_container.current.appendChild(canvas)
        }

    },[links,page]);

    return <div className={styles.LinkCanvasContainer} ref={canvas_container} />
}

export {getLinkedSpecies,getLinkSkeletons,LinkCanvas}
