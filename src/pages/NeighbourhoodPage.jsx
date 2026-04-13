import React, { useEffect, useState } from 'react'
import { useHouseStore } from '../store/houseStore'
import { useAuthStore } from '../store/authStore'
import DollHouse from '../components/neighbourhood/DollHouse'
import './NeighbourhoodPage.css'

export default function NeighbourhoodPage() {
  const { houses, fetchAllHouses, loading } = useHouseStore()
  const user = useAuthStore((s) => s.user)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchAllHouses() }, [])

  const filtered = houses.filter((h) =>
    h.profiles?.username?.toLowerCase().includes(search.toLowerCase()) ||
    h.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="neighbourhood-screen">
      {/* Sky & clouds */}
      <div className="sky">
        <div className="cloud cloud-1">☁</div>
        <div className="cloud cloud-2">☁</div>
        <div className="cloud cloud-3">☁</div>
      </div>

      {/* Header */}
      <div className="neighbourhood-header">
        <h1 className="neighbourhood-title">the House</h1>
        <p className="neighbourhood-subtitle">
          Every life, a story. Every story, a home.
        </p>

        <div className="search-wrap">
          <input
            className="search-input"
            placeholder="🔍 Find someone's house…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {!user && (
          <div className="join-banner">
            <span>Ready to move in?</span>
            <a href="/auth?mode=signup" className="btn btn-gold">
              Get Your House
            </a>
          </div>
        )}
      </div>

      {/* Street */}
      <div className="street-wrap">
        <div className="street-label">🌳 Founder's Street</div>

        {loading ? (
          <div className="street-loading">Opening the neighbourhood…</div>
        ) : (
          <div className="street">
            {filtered.map((house, i) => (
              <DollHouse
                key={house.id}
                house={house}
                index={i}
                isMayor={house.profiles?.username === 'gary'}
              />
            ))}

            {/* Empty plot for new residents */}
            {!user && (
              <div className="empty-plot">
                <div className="empty-plot-icon">🏗</div>
                <div className="empty-plot-text">Your house<br />could be here</div>
                <a href="/auth?mode=signup" className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.9rem' }}>
                  Move In
                </a>
              </div>
            )}
          </div>
        )}

        {/* Street road */}
        <div className="street-road">
          <div className="road-line" />
        </div>
      </div>
    </main>
  )
}
