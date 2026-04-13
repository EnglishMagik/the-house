import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://sulvsmzjgebqvdtrnbwn.supabase.co'
const SUPABASE_KEY = 'sb_publishable_o1emnWWaS5CNgdbnEaoQoA_InT25R_e'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
