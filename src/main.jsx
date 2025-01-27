import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ProjectPromptProvider } from './context/ProjectPromptContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProjectPromptProvider>
      <App />
    </ProjectPromptProvider>,
  </StrictMode>
)
