import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './globalStyles.css'
import { I18nProvider } from './contexts/I18nContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'
import CssBaseline from '@mui/material/CssBaseline'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <ThemeProvider>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </I18nProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
