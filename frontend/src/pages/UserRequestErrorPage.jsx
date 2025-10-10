import NavButton from '../components/NavButton.jsx'

const UserRequestErrorPage=()=>{
    return (
        <div style={{marginLeft:"40px"}}>
            <h1 style={{marginLeft:"0px"}}>Request error</h1>
            <p style={{marginLeft:"0px"}}>Either report the error, check the setup or try again</p>
            <NavButton style_overrides={{background:'linear-gradient(180deg,rgba(255,255,255,0) 60%, #0F0 100%)',paddingBottom: "0.1em"}} destination={"/user/pick-species"}>Pick a different species</NavButton>
        </div>
    )
}
export default UserRequestErrorPage;
