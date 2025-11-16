import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://192.168.1.4:54321'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5aGRtaGxoYXVreWhhdW55bmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTM0NzgsImV4cCI6MjA3ODc2OTQ3OH0.9xkM2W-kUhRIpkiTdxhkxU52f9eTjNQYrAzucTyWBtQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)  