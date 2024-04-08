import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON } from '$env/static/public';

// Create a single supabase client for interacting with your database
const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON)

export { supabase };
