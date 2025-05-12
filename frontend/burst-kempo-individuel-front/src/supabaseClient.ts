import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vdsfjijebgycsdhutibk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkc2ZqaWplYmd5Y3NkaHV0aWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NTgxNTQsImV4cCI6MjA2MjEzNDE1NH0.wnhiQ3qMcAXnB0T-9EPSBZ5slP-exuHnSGZ7kELJnTY'
export const supabase = createClient(supabaseUrl, supabaseKey)