import {useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

const AccountPage=()=>{
    const navigate=useNavigate();
    const [username,setUsername]=useState(null);

    const fetchAccountInfo=()=>{
        let percieved_username=localStorage.getItem("client_percieved_username")
        const token=localStorage.getItem("accessToken")
        if(percieved_username.includes("<GOOGLE_USER>")){
            percieved_username=percieved_username.split("<GOOGLE_USER>")[1];
        }
        setUsername(percieved_username);
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
