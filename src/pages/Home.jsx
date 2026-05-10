import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../index.css'
import { PiClockCountdownFill } from "react-icons/pi";
import { AiFillCarryOut } from "react-icons/ai";
import { BsAward } from "react-icons/bs";

function Home() {
  const [seriesList, setSeriesList] = useState([])
  const [history, setHistory] = useState([])
  
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [episodes, setEpisodes] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [rating, setRating] = useState('')
  
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchSeries()
    fetchHistory()
  }, [])

  const fetchSeries = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:8080/api/series', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSeriesList(response.data.data || [])
    } catch (error) {
      console.error("ดึงข้อมูลซีรีส์ไม่สำเร็จ", error)
    }
  }

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:8080/api/history', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setHistory(response.data.data || [])
    } catch (error) {
      console.error("ดึงประวัติการดูไม่สำเร็จ", error)
    }
  }

const handleAddSeries = async (e) => {
    e.preventDefault()
    
    // ตรวจสอบคะแนนก่อนส่ง
    const score = parseFloat(rating) || 0;
    if (score > 10 || score < 0) {
      alert("กรุณาให้คะแนนระหว่าง 0 - 10 ครับ");
      return;
    }

    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:8080/api/series', {
        Title: title,
        Genre: genre,
        TotalEpisodes: parseInt(episodes),
        CoverURL: coverUrl,       
        AvgRating: score         
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      alert('บันทึกซีรีส์ใหม่ลงแฟ้มเรียบร้อย! 📚')
      // ล้างฟอร์มให้เกลี้ยง
      setTitle(''); setGenre(''); setEpisodes(''); setCoverUrl(''); setRating('');
      fetchSeries()
    } catch (error) {
      alert('เพิ่มซีรีส์ไม่สำเร็จ กรุณาลองใหม่')
    }
  }

  const handleWatch = async (seriesId, seriesTitle) => {
    const episode = prompt(`คุณดูเรื่อง "${seriesTitle}" ถึงตอนที่เท่าไหร่แล้ว?`)
    if (!episode || isNaN(episode)) return

    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:8080/api/history', {
        series_id: seriesId,
        current_episode: parseInt(episode)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      fetchHistory() 
    } catch (error) {
      alert('ไม่สามารถบันทึกประวัติได้')
    }
  }

  const handleRate = async (seriesId, currentTitle) => {
    const rating = prompt(`ให้คะแนนเรื่อง "${currentTitle}" เท่าไหร่ดีครับ? (1-10 คะแนน)`);
    if (!rating) return;
    
    const score = parseFloat(rating);
    if (isNaN(score) || score < 1 || score > 10) {
      alert("กรุณาให้คะแนนเป็นตัวเลขระหว่าง 1 ถึง 10 ครับ");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/rate', {
        series_id: seriesId,
        avg_rating: score 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchSeries(); 
    } catch (error) {
      alert('ไม่สามารถบันทึกคะแนนได้');
    }
  }

  const handleDelete = async (seriesId, title) => {
  if (!window.confirm(`คุณแน่ใจใช่ไหมว่าจะลบ "${title}" ออกจากไดอารี่?`)) return;

  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:8080/api/series/${seriesId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('ลบเรียบร้อยแล้วครับ');
    fetchSeries(); 
  } catch (error) {
    alert('ไม่สามารถลบได้ กรุณาลองใหม่');
  }
};

const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

// 🧹 1. กรอง "ข้อมูลผี" ทิ้งไป (เอาเฉพาะประวัติที่มีซีรีส์อยู่จริงเท่านั้น)
const validHistory = history.filter(h => h.series && h.series.ID !== 0 && h.series.Title);

// 🕒 2. แยกกลุ่ม: ซีรีส์ที่ "ดูค้างไว้" (ตอนปัจจุบัน < ตอนทั้งหมด)
const watchingList = validHistory.filter(
  h => h.current_episode < h.series.TotalEpisodes || h.series.TotalEpisodes === 0
);

// ✅ 3. แยกกลุ่ม: ซีรีส์ที่ "ดูจบแล้ว" (ตอนปัจจุบัน >= ตอนทั้งหมด)
const finishedList = validHistory.filter(
  h => h.current_episode >= h.series.TotalEpisodes && h.series.TotalEpisodes > 0
);

  return (
    <div className="container">
      <div className="header-top">
        <h1 className="page-title">🍿 Series Diary</h1>
        <button onClick={handleLogout} className="btn-logout">
          ออกจากระบบ
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3 className="card-title">➕ เพิ่มซีรีส์ใหม่</h3>
          <form onSubmit={handleAddSeries}>
            <div className="form-group">
              <label>ชื่อเรื่อง:</label>
              <input type="text" className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>แนวเรื่อง (เช่น โรแมนติก, ย้อนยุค):</label>
              <input type="text" className="input-field" value={genre} onChange={(e) => setGenre(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>จำนวนตอนทั้งหมด:</label>
              <input type="number" className="input-field" value={episodes} onChange={(e) => setEpisodes(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>ลิงก์รูปภาพหน้าปก (Image URL):</label>
              <input 
                type="url" 
                className="input-field" 
                value={coverUrl} 
                onChange={(e) => setCoverUrl(e.target.value)} 
                placeholder="https://..." 
              />
            </div>
            <div className="form-group">
              <label>คะแนนความชอบ (เต็ม 10):</label>
              <input 
                type="number" 
                step="0.1" 
                className="input-field" 
                value={rating} 
                onChange={(e) => setRating(e.target.value)} 
                placeholder="เช่น 8.5" 
              />
              </div>
            <button type="submit" className="btn btn-primary">บันทึกลงคลัง</button>
          </form>
        </div>

        <div className="history-column">
          <div className="card highlight-card">
            <h3 className="card-title"><PiClockCountdownFill /> ดูค้างไว้</h3>
            {watchingList.length === 0 ? <p style={{ color: '#7f8c8d' }}>ไม่มีซีรีส์ที่ดูค้างไว้</p> : (
              <ul className="history-list">
                {watchingList.map((h) => (
                  <li key={h.ID} className="history-item">
                    <div>
                      <h4>{h.series.Title}</h4>
                    </div>
                    <span>EP. {h.current_episode} / {h.series.TotalEpisodes}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card finished-card">
            <h3 className="card-title"><AiFillCarryOut /> ดูจบแล้ว</h3>
            {finishedList.length === 0 ? <p style={{ color: '#7f8c8d' }}>ยังไม่มีซีรีส์ที่ดูจบ</p> : (
              <ul className="history-list">
                {finishedList.map((h) => (
                  <li key={h.ID} className="history-item finished-item">
                    <div>
                      <h4>{h.series.Title}</h4>
                    </div>
                    <span className="finished-badge">จบแล้ว <BsAward /></span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <h3 className="card-title" style={{ marginTop: '40px' }}>📺 คลังซีรีส์ทั้งหมดในระบบ</h3>
      <div className="series-grid">
        {seriesList.map((series) => (
          <div key={series.ID} className="series-card">
            
            {series.CoverURL ? (
              <img src={series.CoverURL} alt={series.Title} className="series-cover" />
            ) : (
              <div className="series-cover-placeholder">ไม่มีหน้าปก</div>
            )}

            <h3>{series.Title}</h3>
            <p>แนว: {series.Genre} | {series.TotalEpisodes} ตอน</p>
            
            <div className="rating-display">
              <span className="star-icon">⭐</span> 
              <span className="rating-score">
                {series.AvgRating > 0 ? `${series.AvgRating.toFixed(1)} / 10` : "ยังไม่มีคะแนน"}
              </span>
            </div>

            <div className="action-buttons">
              <button onClick={() => handleWatch(series.ID, series.Title)} className="btn btn-success flex-2">
                ▶️ ดูต่อ
              </button>
              <button onClick={() => handleRate(series.ID, series.Title)} className="btn btn-warning flex-1">
                ⭐ ให้คะแนน
              </button>
              <button onClick={() => handleDelete(series.ID, series.Title)} className="btn btn-danger">
                🗑️ ลบรายการนี้
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>
  )
}

export default Home