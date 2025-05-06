import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vdsfjijebgycsdhutibk.supabase.co'
const supabaseKey = '610153630969-0g0s12r0hi4ppljbpu62ipk2dl4mip3d.apps.googleusercontent.com'
export const supabase = createClient(supabaseUrl, supabaseKey)