import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerServiceWorker, setupInstallPromptListener } from './pwa'

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register PWA service worker (progressive enhancement)
registerServiceWorker()

// Set up install prompt listener for future "Install Grundy" button
setupInstallPromptListener()
