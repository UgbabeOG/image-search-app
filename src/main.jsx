import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ErrorBoundary } from 'react-error-boundary'

ReactDOM.createRoot(document.getElementById('root')).render(
 <ErrorBoundary fallback={<p>error check console</p>}><React.StrictMode>
 <App />
</React.StrictMode>,</ErrorBoundary> 
)
