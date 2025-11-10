const TravelModeRadioButtons=({method,setMethod})=>{

    

    const handleChange=(_event)=>{
        setMethod(_event.target.value)
    }

    return (
        <div style={{width:"100%",display:"flex",flexDirection:"row"}}>
            <label className="custom-radio">
                <input type="radio" name="transit" value="transit" checked={method=== "transit"} onChange={handleChange} />
                Public Transport
            </label>
            <label className="custom-radio">
                <input type="radio" name="walking" value="walking" checked={method=== "walking"} onChange={handleChange} />
                Walking
            </label>
            <label className="custom-radio">
                <input type="radio" name="bicycling" value="bicycling" checked={method=== "bicycling"} onChange={handleChange} />
                Cycling
            </label>
            <label className="custom-radio">
                <input type="radio" name="driving" value="driving" checked={method=== "driving"} onChange={handleChange} />
                Driving
            </label>
        </div>
  );
}
export default TravelModeRadioButtons;
