import React from 'react'
import { useNavigate } from 'react-router-dom'
import './DollHouse.css'

const HOUSE_STYLES = {
  victorian: {
    roofColor: '#4a3728',
    wallColor: '#f5e6d0',
    doorColor: '#8b2020',
    trimColor: '#c9943a',
    windowColor: '#add8e6',
  },
  modern: {
    roofColor: '#2c3e50',
    wallColor: '#ecf0f1',
    doorColor: '#2c3e50',
    trimColor: '#3498db',
    windowColor: '#85c1e9',
  },
  cottage: {
    roofColor: '#6b4226',
    wallColor: '#fdf5e6',
    doorColor: '#4a7c59',
    trimColor: '#8b6340',
    windowColor: '#90ee90',
  },
  minimalist: {
    roofColor: '#555',
    wallColor: '#ffffff',
    doorColor: '#333',
    trimColor: '#999',
    windowColor: '#cce5ff',
  },
}

export default function DollHouse({ house, index, isMayor }) {
  const navigate = useNavigate()
  const style = HOUSE_STYLES[house.style] || HOUSE_STYLES.victorian
  const isPublic = house.is_public
  const username = house.profiles?.username
  const name = house.profiles?.full_name || username

  const handleClick = () => {
    if (isPublic && username) navigate(`/${username}`)
  }

  return (
    <div
      className={`dollhouse-wrap ${isMayor ? 'mayor' : ''} ${!isPublic ? 'private' : ''}`}
      onClick={handleClick}
      style={{ animationDelay: `${index * 0.1}s` }}
      title={isPublic ? `Visit ${name}'s home` : 'Private home'}
    >
      {/* Badges */}
      {isMayor && <div className="badge badge-mayor">👑 Mayor</div>}
      {!isPublic && <div className="badge badge-private">🔒 Private</div>}
      {Date.now() - new Date(house.created_at) < 7 * 24 * 60 * 60 * 1000 && (
        <div className="badge badge-new">✨ New</div>
      )}

      {/* House SVG */}
      <svg
        viewBox="0 0 160 200"
        xmlns="http://www.w3.org/2000/svg"
        className="house-svg"
      >
        {/* Roof */}
        <polygon points="80,10 155,70 5,70" fill={style.roofColor} />
        {/* Chimney */}
        <rect x="110" y="20" width="14" height="30" fill={style.roofColor} />
        <rect x="108" y="17" width="18" height="6" fill={style.trimColor} />
        {/* Roof trim */}
        <polygon points="80,14 152,70 8,70" fill="none" stroke={style.trimColor} strokeWidth="2" />

        {/* Walls */}
        <rect x="10" y="70" width="140" height="120" fill={style.wallColor} />
        {/* Wall trim */}
        <rect x="10" y="70" width="140" height="4" fill={style.trimColor} />
        <rect x="10" y="186" width="140" height="4" fill={style.trimColor} />

        {/* Windows row 1 */}
        <rect x="22" y="85" width="32" height="28" rx="2" fill={style.windowColor} stroke={style.trimColor} strokeWidth="2" />
        <line x1="38" y1="85" x2="38" y2="113" stroke={style.trimColor} strokeWidth="1" />
        <line x1="22" y1="99" x2="54" y2="99" stroke={style.trimColor} strokeWidth="1" />

        <rect x="106" y="85" width="32" height="28" rx="2" fill={style.windowColor} stroke={style.trimColor} strokeWidth="2" />
        <line x1="122" y1="85" x2="122" y2="113" stroke={style.trimColor} strokeWidth="1" />
        <line x1="106" y1="99" x2="138" y2="99" stroke={style.trimColor} strokeWidth="1" />

        {/* Glow effect for open houses */}
        {isPublic && (
          <>
            <rect x="22" y="85" width="32" height="28" rx="2" fill="rgba(255,220,100,0.3)" />
            <rect x="106" y="85" width="32" height="28" rx="2" fill="rgba(255,220,100,0.3)" />
          </>
        )}

        {/* Door */}
        <rect x="60" y="130" width="40" height="60" rx="3" fill={style.doorColor} />
        <rect x="60" y="130" width="40" height="8" rx="3" fill={style.trimColor} />
        {/* Door knob */}
        <circle cx="95" cy="163" r="3" fill={style.trimColor} />
        {/* Door window */}
        <rect x="67" y="140" width="26" height="18" rx="2" fill={style.windowColor} opacity="0.7" />

        {/* Steps */}
        <rect x="55" y="188" width="50" height="6" rx="1" fill={style.trimColor} />
        <rect x="50" y="192" width="60" height="5" rx="1" fill={style.trimColor} opacity="0.6" />

        {/* Lantern for open houses */}
        {isPublic && (
          <g>
            <line x1="15" y1="70" x2="15" y2="83" stroke={style.trimColor} strokeWidth="1.5" />
            <rect x="11" y="83" width="8" height="10" rx="1" fill="#f0c040" opacity="0.9" />
          </g>
        )}

        {/* Lock for private */}
        {!isPublic && (
          <text x="78" y="170" fontSize="14" textAnchor="middle">🔒</text>
        )}
      </svg>

      {/* Name plate */}
      <div className="nameplate">
        <div className="nameplate-name">{name}</div>
        <div className="nameplate-title">{house.title}</div>
      </div>

      {isPublic && (
        <div className="visit-hint">Click to visit →</div>
      )}
    </div>
  )
}
