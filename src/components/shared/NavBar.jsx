import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import './NavBar.css'

export default function NavBar() {
  const { user, profile, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <nav className="navbar">
     <Link to={user ? "/my-house" : "/"} className="navbar-brand">
        <span className="brand-icon">🏠</span>
        <span className="brand-text">the House</span>
      </Link>

      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/my-house" className="nav-link">My House</Link>
            {profile?.is_admin && <Link to="/admin" className="nav-link">Admin</Link>}
            <button className="nav-btn" onClick={handleSignOut}>Leave</button>
          </>
        ) : (
          <>
            <Link to="/auth" className="nav-link">Sign In</Link>
            <Link to="/auth?mode=signup" className="nav-btn nav-btn-primary">Join the House</Link>
          </>
        )}
      </div>
    </nav>
  )
}
