import {useState,useEffect} from 'react';

const GoogleMapsPathEmbed=({start=null,end=null,method=null})=>{

    const [iFrameSRC,setIFrameSRC]=useState("");

    useEffect(()=>{
        setIFrameSRC("https://www.google.com/maps/embed/v1/directions?key=AIzaSyAX5JtPgY6WYKhpG2hnVT-9I6gvNbJp2gg&origin="+start.replace(" ","+")+"&destination="+end.replace(" ","+")+"&mode="+method)
    },[start,end,method])

    return start&&end&&method&&(
            <iframe src={iFrameSRC} style={{width:"100%",height:"600px"}}>
            </iframe>
    )

}
export default GoogleMapsPathEmbed;
