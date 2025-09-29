import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {AuthContext,AuthUse,AuthProvider} from './context/authContext.jsx'
import App from './App.jsx'
import './css/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
        <App />
    </AuthProvider>
  </StrictMode>,
)
