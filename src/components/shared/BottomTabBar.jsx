import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import './BottomTabBar.css'

export default function BottomTabBar() {
  const { user, profile } = useAuthStore()
  const { pathname } = useLocation()

  const profileTo = user && profile?.username ? `/${profile.username}` : '/auth'

  const tabs = [
    { key: 'street',  icon: '🏠', label: 'Street',   to: '/' },
    { key: 'myhouse', icon: '🚪', label: 'My Home',   to: user ? '/my-house' : '/auth' },
    { key: 'profile', icon: '👤', label: 'Profile',   to: profileTo },
  ]

  const isActive = (tab) => {
    if (tab.key === 'street')  return pathname === '/'
    if (tab.key === 'myhouse') return pathname === '/my-house'
    if (tab.key === 'profile') return !!profile?.username && pathname === `/${profile.username}`
    return false
  }

  return (
    <nav className="bottom-tab-bar">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          to={tab.to}
          className={`bottom-tab ${isActive(tab) ? 'active' : ''}`}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </Link>
      ))}
    </nav>
  )
}
