import {Route,Navigate,createBrowserRouter,createRoutesFromElements,RouterProvider} from 'react-router-dom';
import {Howl} from 'howler'
import {useEffect} from 'react'
import interactiveClickSound from '../public/audio/InteractiveClickSound.wav'
import nonInteractiveClickSound from '../public/audio/NonInteractiveClickSound.wav'
import typingSound from '../public/audio/TypingSound.wav'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminPanelLayout from './layouts/AdminPanelLayout.jsx' 
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import AdminAddSpeciesPage from './pages/AdminAddSpeciesPage.jsx' 
import AdminEditSpeciesMenuPage from './pages/AdminEditSpeciesMenuPage.jsx'
import AdminEditSpeciesPage from './pages/AdminEditSpeciesPage.jsx'
import AdminRequestErrorPage from './pages/AdminRequestErrorPage.jsx'
import UserPanelLayout from './layouts/UserPanelLayout.jsx'
import UserPickSpeciesPage from './pages/UserPickSpeciesPage.jsx'
import UserMapPage from './pages/UserMapPage.jsx'
import UserAccountMethodPage from './pages/UserAccountMethodPage.jsx'
import UserLoginPage from './pages/UserLoginPage.jsx'
import UserRegisterPage from './pages/UserRegisterPage.jsx'
import UserRequestErrorPage from './pages/UserRequestErrorPage.jsx'
import UserIdentifySpeciesPage from './pages/UserIdentifySpeciesPage.jsx'
import AccountPanelLayout from './layouts/AccountPanelLayout.jsx'
import AccountPage from './pages/AccountPage.jsx'
import UsagePage from './pages/UsagePage.jsx'
import LandingPanelLayout from './layouts/LandingPanelLayout.jsx'
import LandingPage from './pages/LandingPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function App() {
  const router=createBrowserRouter(
        createRoutesFromElements([
                <Route path="/admin/" element={<AdminPanelLayout />}>
                    <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboardPage />} minimum_authentication_level="admin" />} />
                    <Route path="/admin/add-species" element={<ProtectedRoute element={<AdminAddSpeciesPage />} minimum_authentication_level="admin" />} /> 
                    <Route path="/admin/update-species" element={<ProtectedRoute element={<AdminEditSpeciesMenuPage />} minimum_authentication_level="admin" />} />
                    <Route path="/admin/update-species/:name" element={<ProtectedRoute element={<AdminEditSpeciesPage />} minimum_authentication_level="admin" />} />
                    <Route path="/admin/request-error" element={<ProtectedRoute element={<AdminRequestErrorPage />} minimum_authentication_level="admin" />} />
                    <Route path="/admin/*" element={<ProtectedRoute element={<NotFoundPage redirect="/admin/dashboard" />} minimum_authentication_level="admin" />} />
                </Route>,
                <Route path="/user/" element={<UserPanelLayout />}>
                    <Route path="/user/pick-species" element={<ProtectedRoute element={<UserPickSpeciesPage />} minimum_authentication_level="user" />} />                    
                    <Route path="/user/map/:species_name" element={<ProtectedRoute element={<UserMapPage/>} minimum_authentication_level="user"/>} />
                    <Route path="/user/account-method" element={<UserAccountMethodPage />} />
                    <Route path="/user/login" element={<UserLoginPage />} />
                    <Route path="/user/register" element={<UserRegisterPage />} />
                    <Route path="/user/request-error" element={<UserRequestErrorPage />} />
                    <Route path="/user/identify" element={<ProtectedRoute element={<UserIdentifySpeciesPage />} minimum_authentication_level="user"/>} />
                    <Route path="/user/*" element={<NotFoundPage redirect="/user/pick-species/"/>} />
                </Route>,
                <Route path="/account/" element={<AccountPanelLayout />}>
                    <Route path="/account/" element={<ProtectedRoute element={<AccountPage />} minimum_authentication_level="user" />} />
                    <Route path="/account/*" element={<NotFoundPage redirect="/user/account-method/" />} />
                </Route>,
                <Route path="/usage/" element={<UserPanelLayout />}>
                    <Route path="/usage/" element={<UsagePage />} />
                </Route>,


                <Route path="/landing/" element={<LandingPanelLayout />}>
                    <Route path="/landing/" element={<LandingPage />} />
                </Route>,

                <Route path="/" element={<Navigate to="/landing/" replace />} />,
                <Route path="*" element={<NotFoundPage redirect="/landing/"/>} />
            ]
        )
  );

  const addAudioListener=()=>{
        const interactive_audio=new Howl({
            src: [interactiveClickSound],
            volume: 0.4,
        }) 
        const non_interactive_audio=new Howl({
            src: [nonInteractiveClickSound],
            volume: 0.3,
        })
        const typing_audio=new Howl({
            src: [typingSound],
            volume: 0.4,
        })
        const playClickSFX=(event_)=>{
            if(event_.target.closest("button, a, input, select, textarea")){
                interactive_audio.play();
            }else{
                non_interactive_audio.play();
            }
        }
        const playTypingSFX=(event_)=>{
            if(event_.target.closest("input, textarea")){
                typing_audio.play();
            }
        }

        document.addEventListener("click",playClickSFX)
        document.addEventListener("keydown",playTypingSFX)
        return ()=>{
                document.removeEventListener("click",playClickSFX)
                document.removeEventListener("keydown",playTypingSFX)
        }
  }

  useEffect(()=>{
        addAudioListener();
  },[]);

  return <RouterProvider router={router} />
}

export default App
