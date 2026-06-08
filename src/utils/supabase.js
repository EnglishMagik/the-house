import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://sulvsmzjgebqvdtrnbwn.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bHZzbXpqZ2VicXZkdHJuYnduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNzA2NDYsImV4cCI6MjA5MTY0NjY0Nn0.E0fcWEXiwIsdQEFijfeIBJxParks-aFU0zI4sB95-CQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
