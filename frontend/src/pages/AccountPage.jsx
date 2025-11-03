import {useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

const AccountPage=()=>{
    const navigate=useNavigate();
    const [username,setUsername]=useState(null);

    const fetchAccountInfo=async ()=>{
        let percieved_username=localStorage.getItem("client_percieved_username")
        const token=localStorage.getItem("accessToken")
        if(percieved_username.includes("<GOOGLE_USER>")){
            percieved_username=percieved_username.split("<GOOGLE_USER>")[1];
        }
        setUsername(percieved_username);
        const user_details_response=await fetch("https://api.theaspenproject.cloud/api/account/info/"+percieved_username)
        if((!user_details_response.Error)&&user_details_response.status===200){
            user_details_data=await user_details_response.json()
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
    },[username])

    return(
        <div>
            <h1>Account</h1>
            {username&&<h3>{username}</h3>}
            <button onClick={userClickedToLogout}>Log Out</button>
        </div>
    )
}
export default AccountPage
