import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zhbjxshlsvxxggpyrygb.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY; // ✅ Vite way
export const supabase = createClient(supabaseUrl, 
                                    supabaseKey,
                                    {
                                        auth: {
                                        persistSession: true,
                                        autoRefreshToken: true,
                                        detectSessionInUrl: true, // required for OAuth
                                        },
                                    })

