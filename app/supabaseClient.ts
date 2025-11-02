import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://192.168.0.107:54321'
const SUPABASE_ANON_KEY = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)  