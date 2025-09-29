import {createContext,useState,useContext,useEffect} from 'react';

const checkAuthorization=(authorization_level,minimum_level_of_authorization)=>{
    const ordered_authorization_levels=["user","admin"];
    const minimum_authorization_level_number=ordered_authorization_levels.indexOf(minimum_level_of_authorization);
    const used_authorization_level_number=ordered_authorization_levels.indexOf(authorization_level);
    if(used_authorization_level_number>=minimum_authorization_level_number){
        return true;
    }else{
        return false;
    }
}

const AuthContext=createContext();

const AuthUse=()=>{
        return useContext(AuthContext);
}

const AuthProvider = ({children})=>{
    const [authenticationLevel,setAuthenticationLevel]=useState("None");
    const [username,setUsername]=useState("")
    const login=(name,authentication_level)=>{
        setAuthenticationLevel(authentication_level);
        setUsername(name)
        localStorage.setItem("client_percieved_user_level",authentication_level)
        localStorage.setItem("client_percieved_username",name)
    }
    useEffect(()=>{
        const saved_authentication_level=localStorage.getItem("client_percieved_user_level");
        if(saved_authentication_level){
            setAuthenticationLevel(saved_authentication_level);
        }
        const saved_username=localStorage.getItem("client_percieved_username");
        if(saved_username){
            setUsername(saved_username);
        }
    })
    return (
        <AuthContext.Provider value={{authenticationLevel, login, username}}>
            {children}
        </AuthContext.Provider>
    )
}
export {AuthContext,AuthUse,AuthProvider,checkAuthorization}
