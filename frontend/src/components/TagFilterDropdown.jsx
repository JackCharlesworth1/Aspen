import {useEffect} from 'react'

const TagFilterDropdown=({tags,getTagFiltersMethod,changeTagFiltersMethod})=>{

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

    return (
        <div>
            <h6>Tag Filter</h6>
            <ul>
                {tags.map((tag,index)=>(
                    <div>
                        <p key={index}>{tag}</p>
                        <input type="checkbox" onClick={()=>{flipTagFilter(index)}}/>
                    </div>
                ))}
            </ul>
        </div>
    )
}
export default TagFilterDropdown;
