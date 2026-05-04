import { create } from 'zustand'
import { supabase } from '../utils/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  init: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        set({ user: session.user })
        await get().fetchProfile(session.user.id)
      }
    } catch (e) {
      console.error('Init error:', e)
    } finally {
      set({ loading: false })
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        set({ user: session.user })
        await get().fetchProfile(session.user.id)
      } else {
        set({ user: null, profile: null })
      }
    })
  },

  fetchProfile: async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (data) set({ profile: data })
    } catch (e) {
      console.error('fetchProfile error:', e)
    }
  },

  signUp: async (email, password, username, fullName, houseStyle) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
        }
      }
    })
    if (error) throw error

    // Create default house
    const { data: house, error: houseError } = await supabase.from('houses').insert({
      user_id: data.user.id,
      title: `${fullName}'s Book of Life`,
      style: houseStyle || 'victorian',
      is_public: true,
    }).select().single()
    if (houseError) throw houseError

    // Create 4 starter rooms
    const starterRooms = [
      { house_id: house.id, name: 'My Story',   room_type: 'story',     position: 0 },
      { house_id: house.id, name: 'Facebook',   room_type: 'facebook',  position: 1 },
      { house_id: house.id, name: 'Videos',     room_type: 'video',     position: 2 },
      { house_id: house.id, name: 'Instagram',  room_type: 'instagram', position: 3 },
    ]
    await supabase.from('rooms').insert(starterRooms)

    return data
  },