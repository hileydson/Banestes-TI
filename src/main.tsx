import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { SessionProvider } from './lib/session'
import { lockScreen } from './lib/lockScreen'
import { initInstallCapture } from './lib/pwa'
import './styles.css'

initInstallCapture()
registerSW({ immediate: true })
lockScreen()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <App />
      </SessionProvider>
    </BrowserRouter>
  </StrictMode>
)
