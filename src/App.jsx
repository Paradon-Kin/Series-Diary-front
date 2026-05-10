import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="*" element={<h2 style={{ textAlign: 'center', color: '#ffffff', marginTop: '50px' }}>404 Not Found ❌</h2>} />
    </Routes>
  )
}

export default App