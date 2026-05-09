import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import '../index.css'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:8080/register', {
        username: username,
        password: password
      })
      alert(response.data.message)
      navigate('/login')
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error)
      } else {
        alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ครับ เช็ก Backend ด่วน!')
      }
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">📝 สมัครสมาชิก</h2>
        <p className="auth-subtitle">เริ่มต้นบันทึกซีรีส์เรื่องโปรดใน Series Diary</p>
        
        <form onSubmit={handleRegister}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>ตั้งชื่อผู้ใช้งาน (Username)</label>
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
            <label>ตั้งรหัสผ่าน (Password)</label>
            <input 
              type="password" 
              className="input-field"
              placeholder="กรอกรหัสผ่านอย่างน้อย 6 ตัวอักษร" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
            ยืนยันการสมัคร
          </button>
        </form>

        <Link to="/login" className="auth-link">
          มีบัญชีอยู่แล้ว? เข้าสู่ระบบที่นี่
        </Link>
      </div>
    </div>
  )
}

export default Register