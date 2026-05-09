import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' // 1. นำเข้าเครื่องมือสร้างเส้นทาง

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. เอา BrowserRouter มาครอบ App ไว้ */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)