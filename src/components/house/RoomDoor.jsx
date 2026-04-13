import React, { useState } from 'react'
import { useHouseStore } from '../../store/houseStore'
import './RoomDoor.css'

export default function RoomDoor({ room, isOwner }) {
  const { updateRoom } = useHouseStore()
  const [editing, setEditing] = useState(false)
  const content = room.content || {}

  const save = (updates) => {
    updateRoom(room.id, { content: { ...content, ...updates } })
    setEditing(false)
  }

  switch (room.room_type) {
    case 'story':
      return <StoryRoom room={room} content={content} isOwner={isOwner} onSave={save} />
    case 'facebook':
      return <SocialRoom room={room} content={content} isOwner={isOwner} onSave={save} platform="Facebook" icon="📘" color="#1877f2" />
    case 'instagram':
      return <SocialRoom room={room} content={content} isOwner={isOwner} onSave={save} platform="Instagram" icon="📸" color="#e1306c" />
    case 'tiktok':
      return <SocialRoom room={room} content={content} isOwner={isOwner} onSave={save} platform="TikTok" icon="🎵" color="#010101" />
    case 'youtube':
      return <SocialRoom room={room} content={content} isOwner={isOwner} onSave={save} platform="YouTube" icon="▶" color="#ff0000" />
    case 'video':
      return <VideoRoom room={room} content={content} isOwner={isOwner} onSave={save} />
    case 'audio':
      return <AudioRoom room={room} content={content} isOwner={isOwner} onSave={save} />
    case 'gallery':
      return <GalleryRoom room={room} content={content} isOwner={isOwner} onSave={save} />
    case 'links':
      return <LinksRoom room={room} content={content} isOwner={isOwner} onSave={save} />
    default:
      return <CustomRoom room={room} content={content} isOwner={isOwner} onSave={save} />
  }
}

/* ── Story Room ─────────────────── */
function StoryRoom({ content, isOwner, onSave }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(content.text || '')
  const [title, setTitle] = useState(content.title || 'My Story')

  if (editing) return (
    <div className="room-edit-form">
      <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Story title" style={{ marginBottom: '0.75rem' }} />
      <textarea className="input" rows={12} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your story here…" />
      <div className="room-edit-actions">
        <button className="btn btn-primary" onClick={() => onSave({ text, title })}>Save</button>
        <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
      </div>
    </div>
  )

  return (
    <div className="story-room">
      <h3 className="story-title">{content.title || 'My Story'}</h3>
      <div className="story-body">
        {content.text
          ? content.text.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)
          : <p className="room-empty">No story written yet.</p>
        }
      </div>
      {isOwner && <button className="btn btn-secondary room-edit-btn" onClick={() => setEditing(true)}>✎ Edit Story</button>}
    </div>
  )
}

/* ── Social Room ────────────────── */
function SocialRoom({ content, isOwner, onSave, platform, icon, color }) {
  const [editing, setEditing] = useState(false)
  const [url, setUrl] = useState(content.url || '')
  const [bio, setBio] = useState(content.bio || '')

  if (editing) return (
    <div className="room-edit-form">
      <label className="edit-label">{platform} profile URL</label>
      <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={`https://${platform.toLowerCase()}.com/yourname`} style={{ marginBottom: '0.75rem' }} />
      <label className="edit-label">Short bio (optional)</label>
      <textarea className="input" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="What's this page about?" />
      <div className="room-edit-actions">
        <button className="btn btn-primary" onClick={() => onSave({ url, bio })}>Save</button>
        <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
      </div>
    </div>
  )

  return (
    <div className="social-room">
      <div className="social-icon" style={{ color }}>{icon}</div>
      <h3 className="social-platform">{platform}</h3>
      {content.bio && <p className="social-bio">{content.bio}</p>}
      {content.url ? (
        <a href={content.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary social-visit" style={{ background: color }}>
          Visit my {platform} →
        </a>
      ) : (
        <p className="room-empty">No {platform} link added yet.</p>
      )}
      {isOwner && <button className="btn btn-secondary room-edit-btn" onClick={() => setEditing(true)}>✎ Edit</button>}
    </div>
  )
}

/* ── Video Room ─────────────────── */
function VideoRoom({ content, isOwner, onSave }) {
  const [editing, setEditing] = useState(false)
  const [url, setUrl] = useState(content.url || '')
  const [desc, setDesc] = useState(content.desc || '')

  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch')) return url.replace('watch?v=', 'embed/')
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/')
    if (url.includes('vimeo.com/')) return url.replace('vimeo.com/', 'player.vimeo.com/video/')
    return url
  }

  if (editing) return (
    <div className="room-edit-form">
      <label className="edit-label">YouTube or Vimeo URL</label>
      <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." style={{ marginBottom: '0.75rem' }} />
      <label className="edit-label">Description (optional)</label>
      <textarea className="input" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
      <div className="room-edit-actions">
        <button className="btn btn-primary" onClick={() => onSave({ url, desc })}>Save</button>
        <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
      </div>
    </div>
  )

  return (
    <div className="video-room">
      {content.url ? (
        <>
          <div className="video-embed-wrap">
            <iframe src={getEmbedUrl(content.url)} title="Video" frameBorder="0" allowFullScreen className="video-embed" />
          </div>
          {content.desc && <p className="video-desc">{content.desc}</p>}
        </>
      ) : <p className="room-empty">No video added yet.</p>}
      {isOwner && <button className="btn btn-secondary room-edit-btn" onClick={() => setEditing(true)}>✎ Edit</button>}
    </div>
  )
}

/* ── Audio Room ─────────────────── */
function AudioRoom({ content, isOwner, onSave }) {
  const [editing, setEditing] = useState(false)
  const [url, setUrl] = useState(content.url || '')
  const [desc, setDesc] = useState(content.desc || '')

  if (editing) return (
    <div className="room-edit-form">
      <label className="edit-label">SoundCloud or audio URL</label>
      <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://soundcloud.com/..." style={{ marginBottom: '0.75rem' }} />
      <label className="edit-label">Description</label>
      <textarea className="input" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
      <div className="room-edit-actions">
        <button className="btn btn-primary" onClick={() => onSave({ url, desc })}>Save</button>
        <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
      </div>
    </div>
  )

  return (
    <div className="audio-room">
      {content.url ? (
        <>
          {content.url.includes('soundcloud') ? (
            <iframe
              title="SoundCloud"
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(content.url)}&color=%23c9943a`}
            />
          ) : (
            <audio controls src={content.url} style={{ width: '100%' }} />
          )}
          {content.desc && <p className="video-desc">{content.desc}</p>}
        </>
      ) : <p className="room-empty">No audio added yet.</p>}
      {isOwner && <button className="btn btn-secondary room-edit-btn" onClick={() => setEditing(true)}>✎ Edit</button>}
    </div>
  )
}

/* ── Gallery Room ───────────────── */
function GalleryRoom({ content, isOwner, onSave }) {
  const [editing, setEditing] = useState(false)
  const [caption, setCaption] = useState(content.caption || '')
  const images = content.images || []

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        onSave({ images: [...images, { src: ev.target.result, name: file.name }] })
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="gallery-room">
      {images.length > 0 ? (
        <div className="gallery-grid">
          {images.map((img, i) => (
            <div key={i} className="gallery-item">
              <img src={img.src} alt={img.name} />
            </div>
          ))}
        </div>
      ) : <p className="room-empty">No images yet.</p>}
      {isOwner && (
        <div className="room-edit-actions" style={{ marginTop: '1rem' }}>
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            + Add Images
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>
        </div>
      )}
    </div>
  )
}

/* ── Links Room ─────────────────── */
function LinksRoom({ content, isOwner, onSave }) {
  const [newLabel, setNewLabel] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const links = content.links || []

  const addLink = () => {
    if (!newLabel || !newUrl) return
    onSave({ links: [...links, { label: newLabel, url: newUrl }] })
    setNewLabel(''); setNewUrl('')
  }

  const removeLink = (i) => {
    const updated = links.filter((_, idx) => idx !== i)
    onSave({ links: updated })
  }

  return (
    <div className="links-room">
      <div className="links-list">
        {links.map((link, i) => (
          <div key={i} className="link-item">
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-btn">
              🔗 {link.label}
            </a>
            {isOwner && <button className="btn-danger" onClick={() => removeLink(i)}>✕</button>}
          </div>
        ))}
        {links.length === 0 && <p className="room-empty">No links added yet.</p>}
      </div>
      {isOwner && (
        <div className="links-add-form">
          <input className="input" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Label (e.g. My Website)" style={{ marginBottom: '0.5rem' }} />
          <input className="input" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." style={{ marginBottom: '0.75rem' }} />
          <button className="btn btn-primary" onClick={addLink}>+ Add Link</button>
        </div>
      )}
    </div>
  )
}

/* ── Custom Room ────────────────── */
function CustomRoom({ content, isOwner, onSave }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(content.text || '')

  if (editing) return (
    <div className="room-edit-form">
      <textarea className="input" rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Add any content here…" />
      <div className="room-edit-actions">
        <button className="btn btn-primary" onClick={() => onSave({ text })}>Save</button>
        <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
      </div>
    </div>
  )

  return (
    <div className="custom-room">
      {content.text
        ? content.text.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)
        : <p className="room-empty">This room is empty.</p>
      }
      {isOwner && <button className="btn btn-secondary room-edit-btn" onClick={() => setEditing(true)}>✎ Edit</button>}
    </div>
  )
}
