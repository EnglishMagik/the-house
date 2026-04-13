import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import './AuthPage.css'

export default function AuthPage() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState(params.get('mode') === 'signup' ? 'signup' : 'signin')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [username, setUsername]   = useState('')
  const [fullName, setFullName]   = useState('')
  const [houseStyle, setStyle]    = useState('victorian')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  const { signIn, signUp, user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => { if (user) navigate('/my-house') }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
        navigate('/my-house')
      } else {
        if (!username.trim()) { setError('Please choose a username.'); setLoading(false); return }
        await signUp(email, password, username.toLowerCase().trim(), fullName)
        navigate('/my-house')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const STYLES = [
    { id: 'victorian', label: 'Victorian',  emoji: '🏚', desc: 'Dark wood, gold trim' },
    { id: 'modern',    label: 'Modern',     emoji: '🏢', desc: 'Clean lines, blue tones' },
    { id: 'cottage',   label: 'Cottage',    emoji: '🌿', desc: 'Cosy, green & warm' },
    { id: 'minimalist',label: 'Minimalist', emoji: '⬜', desc: 'Simple, white & grey' },
  ]

  return (
    <main className="auth-screen">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🏠</div>
          <h1>{mode === 'signin' ? 'Welcome back' : 'Move into the House'}</h1>
          <p>{mode === 'signin' ? 'Open your front door' : 'Create your home'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <>
              <div className="form-field">
                <label>Your full name</label>
                <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Gary Wild" required />
              </div>
              <div className="form-field">
                <label>Username <span className="hint">(your address: thehouse.com/username)</span></label>
                <input className="input" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g,''))} placeholder="e.g. garywild" required />
              </div>
            </>
          )}

          <div className="form-field">
            <label>Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
          </div>

          <div className="form-field">
            <label>Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
          </div>

          {mode === 'signup' && (
            <div className="form-field">
              <label>Choose your house style</label>
              <div className="style-grid">
                {STYLES.map((s) => (
                  <div
                    key={s.id}
                    className={`style-option ${houseStyle === s.id ? 'selected' : ''}`}
                    onClick={() => setStyle(s.id)}
                  >
                    <div className="style-emoji">{s.emoji}</div>
                    <div className="style-label">{s.label}</div>
                    <div className="style-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <div className="auth-error">⚠ {error}</div>}

          <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? '…' : mode === 'signin' ? 'Open the Door' : 'Build My House'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'signin' ? (
            <span>New here? <button onClick={() => setMode('signup')}>Create your house</button></span>
          ) : (
            <span>Already have a house? <button onClick={() => setMode('signin')}>Sign in</button></span>
          )}
        </div>
      </div>
    </main>
  )
}
