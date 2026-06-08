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

  fetchAllHouses: async () => {
    set({ loading: true })
    const { data } = await supabase
      .from('houses')
      .select('*, profiles(username, full_name, avatar_url)')
      .eq('is_public', true)
      .order('created_at', { ascending: true })
    set({ houses: data || [], loading: false })
  },

  fetchHouseByUsername: async (username) => {
    set({ loading: true })
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle()

    if (!profile) { set({ loading: false }); return null }

    const { data: house } = await supabase
      .from('houses')
      .select('*')
      .eq('user_id', profile.id)
      .maybeSingle()

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
      .maybeSingle()

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

  addRoom: async (houseId, name, roomType, content) => {
    const pos = get().rooms.length
    const { data, error } = await supabase
      .from('rooms')
      .insert({ house_id: houseId, name, room_type: roomType, position: pos, content })
      .select()
      .single()
    if (error) {
      get().showToast(`Error: ${error.message}`)
      console.error('addRoom error:', error)
      return false
    }
    if (data) {
      set((s) => ({ rooms: [...s.rooms, data] }))
      get().showToast(`Room "${name}" added! 🚪`)
      return true
    }
    return false
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