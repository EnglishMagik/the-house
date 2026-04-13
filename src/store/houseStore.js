import { create } from 'zustand'
import { supabase } from '../utils/supabase'

export const useHouseStore = create((set, get) => ({
  houses: [],
  currentHouse: null,
  rooms: [],
  loading: false,
  toast: '',

  showToast: (msg) => {
    set({ toast: msg })
    setTimeout(() => set({ toast: '' }), 3000)
  },

  // ── Neighbourhood ──────────────────────
  fetchAllHouses: async () => {
    set({ loading: true })
    const { data } = await supabase
      .from('houses')
      .select('*, profiles(username, full_name, avatar_url)')
      .eq('is_public', true)
      .order('created_at', { ascending: true })
    set({ houses: data || [], loading: false })
  },

  // ── Single house ───────────────────────
  fetchHouseByUsername: async (username) => {
    set({ loading: true })
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (!profile) { set({ loading: false }); return null }

    const { data: house } = await supabase
      .from('houses')
      .select('*')
      .eq('user_id', profile.id)
      .single()

    if (house) {
      const { data: rooms } = await supabase
        .from('rooms')
        .select('*')
        .eq('house_id', house.id)
        .order('position')
      set({ currentHouse: { ...house, profile }, rooms: rooms || [], loading: false })
      return house
    }
    set({ loading: false })
    return null
  },

  fetchMyHouse: async (userId) => {
    const { data: house } = await supabase
      .from('houses')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (house) {
      const { data: rooms } = await supabase
        .from('rooms')
        .select('*')
        .eq('house_id', house.id)
        .order('position')
      set({ currentHouse: house, rooms: rooms || [] })
      return house
    }
    return null
  },

  // ── House updates ──────────────────────
  updateHouse: async (houseId, updates) => {
    const { error } = await supabase
      .from('houses')
      .update(updates)
      .eq('id', houseId)
    if (!error) {
      set((s) => ({ currentHouse: { ...s.currentHouse, ...updates } }))
      get().showToast('House updated!')
    }
  },

  // ── Room CRUD ──────────────────────────
  addRoom: async (houseId, name, roomType) => {
    const pos = get().rooms.length
    const { data, error } = await supabase
      .from('rooms')
      .insert({ house_id: houseId, name, room_type: roomType, position: pos })
      .select()
      .single()
    if (!error && data) {
      set((s) => ({ rooms: [...s.rooms, data] }))
      get().showToast(`Room "${name}" added!`)
    }
  },

  updateRoom: async (roomId, updates) => {
    const { error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', roomId)
    if (!error) {
      set((s) => ({
        rooms: s.rooms.map((r) => r.id === roomId ? { ...r, ...updates } : r)
      }))
      get().showToast('Room saved!')
    }
  },

  deleteRoom: async (roomId) => {
    const { error } = await supabase.from('rooms').delete().eq('id', roomId)
    if (!error) {
      set((s) => ({ rooms: s.rooms.filter((r) => r.id !== roomId) }))
      get().showToast('Room deleted.')
    }
  },
}))
