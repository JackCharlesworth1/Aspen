import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {AuthUse} from '../context/authContext.jsx'
import {GoogleLogin} from '@react-oauth/google';
import ShortInputBox from '../components/ShortInputBox.jsx'
import SubmitButton from '../components/SubmitButton.jsx'
import styles from '../css/UserLoginPage.module.css'

const UserLoginPage=()=>{
    const navigate=useNavigate()

    const{authenticationLevel,login}=AuthUse();

    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")

    const [errorMessage,setErrorMessage]=useState("")

    const loginSubmit=async (event_)=>{
        event_.preventDefault()
        const loginDetails={username,password}
        const result=await fetch("https://api.theaspenproject.cloud/api/user/login",{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(loginDetails)})
        if(result){
            const reply=await result.json()
            if(reply.token){
                localStorage.setItem("accessToken",reply.token)
                login(username,reply.role);
                if(reply.role=="admin"){
                    return navigate("/admin/dashboard")
                }else{
                    return navigate("/user/pick-species")
                }
            }else{
                setErrorMessage(reply)
            }
        }
    }

    const handleGoogleSuccess=async (credential_response)=>{
        try{
            const response=await fetch("https://api.theaspenproject.cloud/api/user/auth/google",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:credential_response.credential})});
            if(!response.ok){
                alert("Failed To Login With Google");
            }
            const data=await response.json();
            console.log("Got Data:",data,"jwt:",data.jwt)
            alert("Logged in with Google")

        }catch(error){
            console.log("Login Failure Error:")
            alert("Failed to login with Google")
        }
    }


    return (
        <div className={styles.LoginBox}>
            <form onSubmit={loginSubmit}>
                <h1 className={styles.LoginTitle}>Login</h1>
                <ShortInputBox inputPropertyName="Username" inputValue={username} inputUpdater={setUsername} />    <ShortInputBox inputPropertyName="Password" inputValue={password} inputUpdater={setPassword} password={true} /> 
                {(errorMessage&&<p>{errorMessage}</p>)}
                <div style={{margin:"20px"}}>
                    <SubmitButton />
                </div>
                <GoogleLogin style={{margin:"20px"}} onSuccess={handleGoogleSuccess} onError={()=>{setErrorMessage("Login With Google Failed")}} />
            </form>
        </div>
    )
}
export default UserLoginPage;
