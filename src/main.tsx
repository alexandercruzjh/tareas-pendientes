import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TaskPending from './TaskPending'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TaskPending />
  </StrictMode>,
)
