import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './popup'

// 确保 DOM 已准备好
const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
