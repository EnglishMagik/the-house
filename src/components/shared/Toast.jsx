// Toast.jsx
import React from 'react'
import { useHouseStore } from '../../store/houseStore'

export default function Toast() {
  const toast = useHouseStore((s) => s.toast)
  return <div className={`toast ${toast ? 'visible' : ''}`}>{toast}</div>
}
