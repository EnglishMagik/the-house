import { create } from 'zustand'
import { supabase } from '../utils/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await get().fetchProfile(session.user.id)
      set({ user: session.user, loading: false })
    } else {
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
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) set({ profile: data })
  },

  signUp: async (email, password, username, fullName) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username,
      full_name: fullName,
      is_admin: false,
    })
    if (profileError) throw profileError

    // Create default house
    const { data: house, error: houseError } = await supabase.from('houses').insert({
      user_id: data.user.id,
      title: `${fullName}'s Book of Life`,
      style: 'victorian',
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

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  },
}))
