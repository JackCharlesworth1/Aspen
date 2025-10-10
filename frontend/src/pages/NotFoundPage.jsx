import NavButton from '../components/NavButton.jsx'

const NotFoundPage=({redirect})=>{
    return(<div>
                <h1 style={{margin:"40px"}}>The page you are looking for couldn't be found</h1>
                <NavButton style_overrides={{marginLeft:"40px",background:'linear-gradient(180deg,rgba(255,255,255,0) 60%, #0F0 100%)',paddingBottom: "0.1em"}} destination={redirect}>Get back on track</NavButton>
            </div>)
}
export default NotFoundPage;
