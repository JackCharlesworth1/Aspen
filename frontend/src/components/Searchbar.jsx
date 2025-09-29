const Searchbar=({getSearchString,changeSearchString})=>{
    
    const setNewSearchbarText=(event_)=>{
        event_.preventDefault()
        changeSearchString(event_.target.value);
    }

    return (
        <input type="text" value={getSearchString()} onChange={(event_)=>setNewSearchbarText(event_)}/>
    )
}
export default Searchbar;
