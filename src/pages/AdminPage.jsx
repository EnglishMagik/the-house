import React, { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import './AdminPage.css'

export default function AdminPage() {
  const [users, setUsers]     = useState([])
  const [houses, setHouses]   = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('users')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at')
    const { data: allHouses } = await supabase.from('houses').select('*, profiles(username, full_name)').order('created_at')
    setUsers(profiles || [])
    setHouses(allHouses || [])
    setLoading(false)
  }

  const toggleAdmin = async (userId, current) => {
    await supabase.from('profiles').update({ is_admin: !current }).eq('id', userId)
    fetchAll()
  }

  const toggleHousePublic = async (houseId, current) => {
    await supabase.from('houses').update({ is_public: !current }).eq('id', houseId)
    fetchAll()
  }

  const deleteUser = async (userId) => {
    if (!confirm('Delete this user and all their data?')) return
    await supabase.from('profiles').delete().eq('id', userId)
    fetchAll()
  }

  return (
    <main className="admin-screen">
      <div className="admin-header">
        <h1>🏛 Admin Panel</h1>
        <p>Manage residents of Home</p>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
          👥 Residents ({users.length})
        </button>
        <button className={`admin-tab ${tab === 'houses' ? 'active' : ''}`} onClick={() => setTab('houses')}>
          🏠 Houses ({houses.length})
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--brown-light)', padding: '3rem' }}>Loading…</p>
        ) : tab === 'users' ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Joined</th>
                  <th>Admin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.full_name || '—'}</td>
                    <td><code>/{u.username}</code></td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className={`admin-toggle ${u.is_admin ? 'on' : 'off'}`}
                        onClick={() => toggleAdmin(u.id, u.is_admin)}
                      >
                        {u.is_admin ? '✓ Admin' : 'User'}
                      </button>
                    </td>
                    <td>
                      <button className="btn-danger" onClick={() => deleteUser(u.id)}>🗑 Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Owner</th>
                  <th>Style</th>
                  <th>Visibility</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {houses.map((h) => (
                  <tr key={h.id}>
                    <td>{h.title}</td>
                    <td><code>/{h.profiles?.username}</code></td>
                    <td style={{ textTransform: 'capitalize' }}>{h.style}</td>
                    <td>
                      <button
                        className={`admin-toggle ${h.is_public ? 'on' : 'off'}`}
                        onClick={() => toggleHousePublic(h.id, h.is_public)}
                      >
                        {h.is_public ? '🌍 Public' : '🔒 Private'}
                      </button>
                    </td>
                    <td>{new Date(h.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
