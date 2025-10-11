import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {AuthUse} from '../context/authContext.jsx'
import ShortInputBox from '../components/ShortInputBox.jsx'
import SubmitButton from '../components/SubmitButton.jsx'
import styles from '../css/UserRegisterPage.module.css'

const UserRegisterPage=()=>{

    const navigate=useNavigate()

    const{authenticationLevel,login}=AuthUse();

    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const [errorMessage,setErrorMessage]=useState("");

    const registerSubmit=async(_event)=>{
        _event.preventDefault()
        const registerInfo={username,email,password}
        const result=await fetch('https://api.theaspenproject.cloud/api/user/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(registerInfo)})
        const reply=await result.json()
        if(reply.success){
            const token=reply.token;
            localStorage.setItem("accessToken",token)
            login(username,"user")
            return navigate("/user/pick-species")
        }else{
           setErrorMessage(reply)
        }
    }
    return (
        <div className={styles.RegisterBox}>
            <form onSubmit={registerSubmit}>
                <h1 className={styles.RegisterTitle}>Register</h1>
                <ShortInputBox inputPropertyName="Username" inputValue={username} inputUpdater={setUsername} />    
                <ShortInputBox inputPropertyName="Email" inputValue={email} inputUpdater={setEmail} />
                <ShortInputBox inputPropertyName="Password" inputValue={password} inputUpdater={setPassword} password={true} /> 
                {(errorMessage&&(<p>{errorMessage}</p>))}

                <div style={{margin:"20px"}}>
                    <SubmitButton />
                </div>
            </form>
        </div>
    )
}
export default UserRegisterPage;
