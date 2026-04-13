import React from 'react'

export default function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--cream)',
      gap: '1rem',
    }}>
      <div style={{ fontSize: '3rem', animation: 'float 2s ease infinite' }}>🏠</div>
      <p style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '1.1rem',
        fontStyle: 'italic',
        color: 'var(--brown-light)',
      }}>
        Opening the door…
      </p>
    </div>
  )
}
