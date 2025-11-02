import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {GoogleOAuthProvider} from '@react-oauth/google'
import {AuthContext,AuthUse,AuthProvider} from './context/authContext.jsx'
import App from './App.jsx'
import './css/global.css'

const VITE_GOOGLE_CLIENT_ID=import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log("Environment variables:",import.meta.env)
console.log("VITE_GOOGLE_CLIENT_ID:",VITE_GOOGLE_CLIENT_ID)

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
            <App />
        </AuthProvider>
    </GoogleOAuthProvider>
)
