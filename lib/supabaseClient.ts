// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!
export const supabase = createClient(supabaseUrl, supabaseAnonKey)


// const { data, error } = await supabase.from('users').select('*')
// console.log('error ye h', error)
// console.log('data ye h', data)