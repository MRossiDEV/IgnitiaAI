import { createClient } from '@supabase/supabase-js'

// ============================================================================
// SUPABASE ADMIN CLIENT (Server-side)
// ============================================================================
// This client is used for server-side operations (API routes, server components)
// It uses the service role key which BYPASSES Row Level Security (RLS) policies
// ⚠️ WARNING: Only use this on the server side, never expose to the client!
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.\n' +
    'Required variables:\n' +
    '- NEXT_PUBLIC_SUPABASE_URL\n' +
    '- SUPABASE_SERVICE_ROLE_KEY'
  )
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

