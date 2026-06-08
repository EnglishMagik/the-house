import React from 'react'
import './DollhouseView.css'

const ROOM_ICONS = {
  story:     '📖',
  video:     '🎬',
  audio:     '🎵',
  facebook:  '📘',
  instagram: '📸',
  tiktok:    '🎵',
  youtube:   '▶',
  links:     '🔗',
  gallery:   '🖼',
  custom:    '✦',
}

const ROOM_COLORS = {
  story:     '#f5e6d0',
  video:     '#dce8f5',
  audio:     '#f0e6f5',
  facebook:  '#dce8ff',
  instagram: '#fde8f0',
  tiktok:    '#e8f5e8',
  youtube:   '#ffe8e8',
  links:     '#f5f5e0',
  gallery:   '#f5ece0',
  custom:    '#f0f0f0',
}

export default function DollhouseView({ rooms, houseStyle, onRoomClick, activeRoom }) {
  const visibleRooms = rooms.filter((r) => r.is_visible)

  return (
    <div className="dollhouse-interior">
      {/* House facade with rooms as windows */}
      <div className="interior-facade">
        <div className="facade-roof">
          <div className="facade-chimney" />
        </div>

        <div className="facade-walls">
          {visibleRooms.map((room, i) => (
            <div
              key={room.id}
              className={`room-window ${activeRoom?.id === room.id ? 'active' : ''}`}
              onClick={() => onRoomClick(room)}
              style={{ background: ROOM_COLORS[room.room_type] || '#f5f5f5' }}
              title={`Enter: ${room.name}`}
            >
              <div className="window-icon">{ROOM_ICONS[room.room_type] || '✦'}</div>
              <div className="window-name">{room.name}</div>
              <div className="window-glow" />
            </div>
          ))}

          {visibleRooms.length === 0 && (
            <div className="no-rooms">
              <p>This home has no rooms yet.</p>
            </div>
          )}
        </div>

        <div className="facade-ground">
          <div className="facade-path" />
          <div className="facade-door">🚪</div>
        </div>
      </div>
    </div>
  )
}
