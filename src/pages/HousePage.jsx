import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useHouseStore } from '../store/houseStore'
import { useAuthStore } from '../store/authStore'
import RoomDoor from '../components/house/RoomDoor'
import DollhouseView from '../components/house/DollhouseView'
import './HousePage.css'

export default function HousePage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { currentHouse, rooms, fetchHouseByUsername, loading } = useHouseStore()
  const { profile } = useAuthStore()
  const [activeRoom, setActiveRoom] = useState(null)

  const isOwner = profile?.username === username

  useEffect(() => {
    fetchHouseByUsername(username)
    setActiveRoom(null)
  }, [username])

  if (loading) return (
    <div className="house-loading">
      <div style={{ fontSize: '3rem', animation: 'float 2s ease infinite' }}>🏠</div>
      <p>Knocking on the door…</p>
    </div>
  )

  if (!currentHouse) return (
    <div className="house-not-found">
      <div style={{ fontSize: '3rem' }}>🚪</div>
      <h2>No one lives here yet</h2>
      <p>This address doesn't exist in the House.</p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>Back to the Street</button>
    </div>
  )

  return (
    <main className="house-screen">
      {/* House header */}
      <div className="house-header">
        <div className="house-header-bg" />
        <div className="house-header-content">
          {currentHouse.cover_image && (
            <img src={currentHouse.cover_image} alt="portrait" className="house-portrait" />
          )}
          <div className="house-meta">
            <h1 className="house-title">{currentHouse.title}</h1>
            {currentHouse.tagline && <p className="house-tagline">{currentHouse.tagline}</p>}
            <div className="house-owner">
              🏠 {currentHouse.profile?.full_name || username}
              {username === 'gary' && <span className="mayor-badge">👑 Mayor</span>}
            </div>
          </div>
          {isOwner && (
            <button className="btn btn-secondary edit-house-btn" onClick={() => navigate('/my-house')}>
              ✎ Edit My House
            </button>
          )}
        </div>
      </div>

      {/* Dollhouse view with rooms as doors/windows */}
      <div className="house-interior">
        <div className="interior-label">— Choose a room to enter —</div>

        <DollhouseView
          rooms={rooms}
          houseStyle={currentHouse.style}
          onRoomClick={setActiveRoom}
          activeRoom={activeRoom}
        />
      </div>

      {/* Active room content */}
      {activeRoom && (
        <div className="room-content-area">
          <div className="room-content-header">
            <h2>{activeRoom.name}</h2>
            <button className="room-close-btn" onClick={() => setActiveRoom(null)}>✕ Close Room</button>
          </div>
          <RoomDoor room={activeRoom} isOwner={isOwner} />
        </div>
      )}

      {/* Back to street */}
      <div className="back-to-street">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          ← Back to the Street
        </button>
      </div>
    </main>
  )
}
