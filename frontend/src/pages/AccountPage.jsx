import {useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import UserStats from '../components/UserStats.jsx'

const AccountPage=()=>{
    const navigate=useNavigate();
    const [username,setUsername]=useState(null);
    const [actualUsername,setActualUsername]=useState(null);
    const [userSeen,setUserSeen]=useState([]);
    const [userSightings,setUserSightings]=useState([]);

    const fetchAccountInfo=async ()=>{
        let percieved_username=localStorage.getItem("client_percieved_username")
        const actual_username=percieved_username;
        const token=localStorage.getItem("accessToken")
        if(percieved_username.includes("<GOOGLE_USER>")){
            percieved_username=percieved_username.split("<GOOGLE_USER>")[1];
        }
        setUsername(percieved_username);
        setActualUsername(actual_username)
        const user_details_response=await fetch("https://api.theaspenproject.cloud/api/account/info/"+actual_username,{headers:{"Authorization":token}})
        if((!user_details_response.Error)&&user_details_response.status===200){
            const user_details_data=await user_details_response.json()
	        if(user_details_data.sightings){
		        setUserSightings(user_details_data.sightings)
	        }
	        if(user_details_data.seen){
		        setUserSeen(user_details_data.seen)
	        }
            console.log("Got Info About User",user_details_data)
        }else{
            console.log("An Error Occured Fetching Account Info:",user_details_response.status,user_details_response.Error)
        }
    }

    const userClickedToLogout=()=>{
        localStorage.setItem("accessToken","")
        localStorage.setItem("client_percieved_user_level","")
        localStorage.setItem("client_percieved_username","")
        navigate("/landing/")
    }

    useEffect(()=>{
       fetchAccountInfo(); 
    },[])

    return(
        <div>
            <h1>Account</h1>
            {username&&<h3>{username}</h3>}
	        <UserStats actual_username={actual_username} user_seen={userSeen} user_sightings={userSightings}/>
            <button onClick={userClickedToLogout}>Log Out</button>
        </div>
    )
}
export default AccountPage
