import {AuthUse,checkAuthorization} from '../context/authContext.jsx'
import ForbiddenAccessPage from '../pages/ForbiddenAccessPage.jsx'

const ProtectedRoute=({element,minimum_authentication_level,...rest})=>{
    const {authenticationLevel} = AuthUse();
    if(!checkAuthorization(authenticationLevel,minimum_authentication_level)){
        return <ForbiddenAccessPage />
    }
    return element;
}
export default ProtectedRoute
