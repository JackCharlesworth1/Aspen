import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {GoogleOAuthProvider} from '@react-oauth/google'
import {AuthContext,AuthUse,AuthProvider} from './context/authContext.jsx'
import App from './App.jsx'
import './css/global.css'

const VITE_GOOGLE_CLIENT_ID="470677434304-08rjstn33b42kes2grk2ru1ucnqi6vce.apps.googleusercontent.com"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
            <App />
        </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
)
