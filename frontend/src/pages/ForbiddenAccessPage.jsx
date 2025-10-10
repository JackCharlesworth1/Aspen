import NavButton from '../components/NavButton.jsx'

const ForbiddenAccessPage=()=>{
    return (
        <div style={{marginLeft:"40px",marginTop:"40px"}}>
            <h1>FORBODEN</h1> 
            <p style={{marginLeft:"0px"}}>You probably just need to remember to login, or you havent signed up yet</p> 
            <NavButton style_overrides={{marginLeft:"0px",background:'linear-gradient(180deg,rgba(255,255,255,0) 60%, #0F0 100%)',paddingBottom: "0.1em"}} destination="/user/account-method">Go to accounts</NavButton>
        </div>
    )
}

export default ForbiddenAccessPage;
