import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { CHECK } from './lib/Assertions.mts'

const container = document.getElementById('root')
CHECK(container instanceof HTMLElement, 'Root element missing')
const host: HTMLElement = container

const root = createRoot(host)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
