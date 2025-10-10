import {useEffect} from 'react'
import styles from '../css/TagFilterDropdown.module.css'

const TagFilterDropdown=({tags,getTagFiltersMethod,changeTagFiltersMethod,shown=true})=>{

    const flipTagFilter=(index)=>{
        const tag_filters_copy=getTagFiltersMethod();
        tag_filters_copy[index]=!(tag_filters_copy[index])
        changeTagFiltersMethod(tag_filters_copy)
    }

    const initializeTagFilters=()=>{
        const tag_filters=Array(tags.length).fill(false);
        changeTagFiltersMethod(tag_filters)
    }

    useEffect(()=>{initializeTagFilters()},[tags])

    return shown&&(
        <div className={styles.TagFilterDropdownContainer}>
            <h3 className={styles.TagFiltersTitle}>Tag Filter</h3>
            <ul className={styles.TagFiltersList}>
                {tags.map((tag,index)=>(
                    <div className={styles.TagFilter}>
                        <p className={styles.TagFilterName} key={index}>{tag}</p>
                        <input className={styles.TagFilterCheckbox} type="checkbox" onClick={()=>{flipTagFilter(index)}} defaultChecked={getTagFiltersMethod()[index]}/>
                    </div>
                ))}
            </ul>
        </div>
    )
}
export default TagFilterDropdown;
