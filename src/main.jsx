// src/index.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './Context/ThemeContext.jsx'
import { FontProvider } from './Context/FontContext.jsx'
import './i18n'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <FontProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </FontProvider>
    </BrowserRouter>
  </React.StrictMode>
)
