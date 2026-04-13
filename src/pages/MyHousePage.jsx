import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useHouseStore } from '../store/houseStore'
import './MyHousePage.css'

const ROOM_TYPES = [
  { type: 'story',     label: 'My Story',   icon: '📖', desc: 'Write your book' },
  { type: 'video',     label: 'Videos',     icon: '🎬', desc: 'YouTube / Vimeo' },
  { type: 'audio',     label: 'Audio',      icon: '🎵', desc: 'SoundCloud / music' },
  { type: 'facebook',  label: 'Facebook',   icon: '📘', desc: 'Your Facebook page' },
  { type: 'instagram', label: 'Instagram',  icon: '📸', desc: 'Your Instagram' },
  { type: 'tiktok',    label: 'TikTok',     icon: '🎵', desc: 'Your TikTok' },
  { type: 'youtube',   label: 'YouTube',    icon: '▶',  desc: 'Your YouTube channel' },
  { type: 'gallery',   label: 'Gallery',    icon: '🖼',  desc: 'Photo gallery' },
  { type: 'links',     label: 'Links',      icon: '🔗', desc: 'Link collection' },
  { type: 'custom',    label: 'Custom',     icon: '✦',  desc: 'Anything you like' },
]

const HOUSE_STYLES = [
  { id: 'victorian',  label: 'Victorian',  emoji: '🏚' },
  { id: 'modern',     label: 'Modern',     emoji: '🏢' },
  { id: 'cottage',    label: 'Cottage',    emoji: '🌿' },
  { id: 'minimalist', label: 'Minimalist', emoji: '⬜' },
]

export default function MyHousePage() {
  const { user, profile } = useAuthStore()
  const { currentHouse, rooms, fetchMyHouse, updateHouse, addRoom, deleteRoom, updateRoom, showToast } = useHouseStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('rooms')
  const [showAddRoom, setShowAddRoom] = useState(false)
  const [newRoomType, setNewRoomType] = useState('custom')
  const [newRoomName, setNewRoomName] = useState('')
  const [editingHouse, setEditingHouse] = useState(false)
  const [houseTitle, setHouseTitle] = useState('')
  const [houseTagline, setHouseTagline] = useState('')

  useEffect(() => {
    if (user) fetchMyHouse(user.id)
  }, [user])

  useEffect(() => {
    if (currentHouse) {
      setHouseTitle(currentHouse.title || '')
      setHouseTagline(currentHouse.tagline || '')
    }
  }, [currentHouse])

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) { showToast('Enter a room name first.'); return }
    await addRoom(currentHouse.id, newRoomName, newRoomType)
    setNewRoomName('')
    setShowAddRoom(false)
  }

  const handleSaveHouse = async () => {
    await updateHouse(currentHouse.id, { title: houseTitle, tagline: houseTagline })
    setEditingHouse(false)
  }

  const handleStyleChange = async (styleId) => {
    await updateHouse(currentHouse.id, { style: styleId })
  }

  const togglePrivacy = async () => {
    await updateHouse(currentHouse.id, { is_public: !currentHouse.is_public })
  }

  const toggleRoomVisibility = async (room) => {
    await updateRoom(room.id, { is_visible: !room.is_visible })
  }

  const shareUrl = `${window.location.origin}/${profile?.username}`

  if (!currentHouse) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'var(--nav-height)' }}>
      <p style={{ fontStyle: 'italic', color: 'var(--brown-light)' }}>Loading your house…</p>
    </div>
  )

  return (
    <main className="myhome-screen">
      {/* Kitchen header */}
      <div className="kitchen-header">
        <div className="kitchen-icon">🍳</div>
        <div className="kitchen-meta">
          <h1>The Kitchen</h1>
          <p>This is where you mix it up — manage your house, rooms, and content.</p>
        </div>
        <button className="btn btn-secondary view-house-btn" onClick={() => navigate(`/${profile?.username}`)}>
          View My House →
        </button>
      </div>

      {/* Share bar */}
      <div className="share-bar">
        <span className="share-label">🔗 Your address:</span>
        <code className="share-url">{shareUrl}</code>
        <button className="btn btn-gold share-copy-btn" onClick={() => { navigator.clipboard.writeText(shareUrl); showToast('Link copied!') }}>
          Copy Link
        </button>
        <button className={`privacy-toggle ${currentHouse.is_public ? 'public' : 'private'}`} onClick={togglePrivacy}>
          {currentHouse.is_public ? '🌍 Public' : '🔒 Private'}
        </button>
      </div>

      {/* Tabs */}
      <div className="kitchen-tabs">
        {['rooms', 'details', 'style'].map((t) => (
          <button
            key={t}
            className={`kitchen-tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t === 'rooms' ? '🚪 Rooms' : t === 'details' ? '✎ Details' : '🎨 Style'}
          </button>
        ))}
      </div>

      <div className="kitchen-content">

        {/* ── ROOMS TAB ── */}
        {activeTab === 'rooms' && (
          <div className="rooms-tab">
            <div className="rooms-list">
              {rooms.map((room, i) => (
                <div key={room.id} className={`room-card ${!room.is_visible ? 'hidden-room' : ''}`}>
                  <div className="room-card-icon">
                    {ROOM_TYPES.find((r) => r.type === room.room_type)?.icon || '✦'}
                  </div>
                  <div className="room-card-info">
                    <div className="room-card-name">{room.name}</div>
                    <div className="room-card-type">{room.room_type}</div>
                  </div>
                  <div className="room-card-actions">
                    <button
                      className={`visibility-btn ${room.is_visible ? 'visible' : 'hidden'}`}
                      onClick={() => toggleRoomVisibility(room)}
                      title={room.is_visible ? 'Hide room' : 'Show room'}
                    >
                      {room.is_visible ? '👁' : '🙈'}
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => { if(confirm(`Delete "${room.name}"?`)) deleteRoom(room.id) }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add room */}
            {showAddRoom ? (
              <div className="add-room-form">
                <h3>Add a New Room</h3>
                <div className="room-type-grid">
                  {ROOM_TYPES.map((rt) => (
                    <div
                      key={rt.type}
                      className={`room-type-option ${newRoomType === rt.type ? 'selected' : ''}`}
                      onClick={() => { setNewRoomType(rt.type); setNewRoomName(rt.label) }}
                    >
                      <div>{rt.icon}</div>
                      <div className="rt-label">{rt.label}</div>
                    </div>
                  ))}
                </div>
                <input
                  className="input"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Room name"
                  style={{ margin: '1rem 0 0.75rem' }}
                />
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-primary" onClick={handleAddRoom}>Add Room</button>
                  <button className="btn btn-secondary" onClick={() => setShowAddRoom(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="btn btn-gold add-room-btn" onClick={() => setShowAddRoom(true)}>
                + Add a Room
              </button>
            )}
          </div>
        )}

        {/* ── DETAILS TAB ── */}
        {activeTab === 'details' && (
          <div className="details-tab">
            <div className="detail-field">
              <label>House / Book Title</label>
              <input className="input" value={houseTitle} onChange={(e) => setHouseTitle(e.target.value)} />
            </div>
            <div className="detail-field">
              <label>Tagline <span style={{ fontWeight: 400, color: 'var(--brown-light)' }}>(shown under your name)</span></label>
              <input className="input" value={houseTagline} onChange={(e) => setHouseTagline(e.target.value)} placeholder="e.g. A life well lived" />
            </div>
            <button className="btn btn-primary" onClick={handleSaveHouse}>Save Details</button>
          </div>
        )}

        {/* ── STYLE TAB ── */}
        {activeTab === 'style' && (
          <div className="style-tab">
            <p style={{ marginBottom: '1.25rem', color: 'var(--brown-light)', fontStyle: 'italic' }}>
              Choose your house style. You can change it any time.
            </p>
            <div className="style-picker">
              {HOUSE_STYLES.map((s) => (
                <div
                  key={s.id}
                  className={`style-card ${currentHouse.style === s.id ? 'selected' : ''}`}
                  onClick={() => handleStyleChange(s.id)}
                >
                  <div className="style-card-emoji">{s.emoji}</div>
                  <div className="style-card-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
