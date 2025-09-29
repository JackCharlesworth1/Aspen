import NavButton from '../components/NavButton.jsx'

const ForbiddenAccessPage=()=>{
    return (
        <div>
            <h1>FORBODEN</h1> 
            <p>you probably just need to remember to login, or you havent signed up yet</p> 
            <NavButton destination="/user/account-method" />
        </div>
    )
}

export default ForbiddenAccessPage;
