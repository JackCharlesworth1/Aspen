import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {GoogleOAuthProvider} from '@react-oauth/google'
import {AuthContext,AuthUse,AuthProvider} from './context/authContext.jsx'
import App from './App.jsx'
import './css/global.css'

const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
            <App />
        </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
