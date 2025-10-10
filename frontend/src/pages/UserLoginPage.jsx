import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {AuthUse} from '../context/authContext.jsx'
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
        const result=await fetch("/api/user/login",{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(loginDetails)})
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

    return (
        <div className={styles.LoginBox}>
            <form onSubmit={loginSubmit}>
                <h1 className={styles.LoginTitle}>Login</h1>
                <ShortInputBox inputPropertyName="Username" inputValue={username} inputUpdater={setUsername} />    
                <ShortInputBox inputPropertyName="Password" inputValue={password} inputUpdater={setPassword} password={true} /> 
                {(errorMessage&&<p>{errorMessage}</p>)}
                <div style={{margin:"20px"}}>
                    <SubmitButton />
                </div>
            </form>
        </div>
    )
}
export default UserLoginPage;
