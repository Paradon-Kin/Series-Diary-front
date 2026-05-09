import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'

function App() {
  return (
    // ลบ nav และฟังก์ชันที่ไม่จำเป็นออกทั้งหมด เหลือแค่การจัดการเส้นทาง (Routes)
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      {/* หน้า 404 เผื่อคนพิมพ์ URL ผิด (ปรับสีตัวหนังสือเป็นสีขาวให้เข้ากับธีม) */}
      <Route path="*" element={<h2 style={{ textAlign: 'center', color: '#ffffff', marginTop: '50px' }}>404 Not Found ❌</h2>} />
    </Routes>
  )
}

export default App