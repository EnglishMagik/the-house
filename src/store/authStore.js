import { create } from 'zustand'
import { supabase } from '../utils/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  init: async () => {
    console.log('[init] start')
    let cancelled = false

    const timeoutId = setTimeout(() => {
      console.log('[init] timed out after 5s')
      cancelled = true
      set({ user: null, profile: null, loading: false })
    }, 5000)

    try {
      console.log('[init] checking session...')
      const { data: { session } } = await supabase.auth.getSession()
      console.log('[init] session result:', session)
      if (cancelled) return

      if (session?.user) {
        set({ user: session.user })
        console.log('[init] fetching profile...')
        await get().fetchProfile(session.user.id)
        console.log('[init] profile fetch complete')
        if (cancelled) return
      }
    } catch (e) {
      console.error('Init error:', e)
    } finally {
      clearTimeout(timeoutId)
      if (!cancelled) set({ loading: false })
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

    const { data: house, error: houseError } = await supabase.from('houses').insert({
      user_id: data.user.id,
      title: fullName + "'s Book of Life",
      style: houseStyle || 'victorian',
      is_public: true,
    }).select().single()
    if (houseError) throw houseError

    const starterRooms = [
      { house_id: house.id, name: 'My Story', room_type: 'story', position: 0 },
      { house_id: house.id, name: 'Facebook', room_type: 'facebook', position: 1 },
      { house_id: house.id, name: 'Videos', room_type: 'video', position: 2 },
      { house_id: house.id, name: 'Instagram', room_type: 'instagram', position: 3 },
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
