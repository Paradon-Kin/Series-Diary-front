import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import '../index.css'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:8080/login', {
        username: username,
        password: password
      })
      localStorage.setItem('token', response.data.token)
      alert(response.data.message)
      navigate('/')
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error)
      } else {
        alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ครับ')
      }
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">🔓 เข้าสู่ระบบ</h2>
        <p className="auth-subtitle">ยินดีต้อนรับกลับสู่ Series Diary</p>
        
        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>ชื่อผู้ใช้งาน (Username)</label>
            <input 
              type="text" 
              className="input-field"
              placeholder="กรอกชื่อผู้ใช้งาน" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>รหัสผ่าน (Password)</label>
            <input 
              type="password" 
              className="input-field"
              placeholder="กรอกรหัสผ่าน" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
            เข้าสู่ระบบ
          </button>
        </form>

        <Link to="/register" className="auth-link">
          ยังไม่มีบัญชีใช่ไหม? สมัครสมาชิกที่นี่
        </Link>
      </div>
    </div>
  )
}

export default Login