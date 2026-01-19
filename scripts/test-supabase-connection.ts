/**
 * Test Supabase Database Connection
 * 
 * This script tests the connection to your Supabase database.
 * 
 * Usage:
 *   npx tsx scripts/test-supabase-connection.ts
 * 
 * Prerequisites:
 *   1. Create a Supabase project at https://supabase.com
 *   2. Run the supabase-complete-schema.sql in your Supabase SQL Editor
 *   3. Copy .env.local.example to .env.local
 *   4. Add your Supabase credentials to .env.local
 */

import { createClient } from '@supabase/supabase-js'

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n')

  // Check environment variables
  console.log('📋 Checking environment variables...')
  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set')
    return false
  }
  if (!supabaseAnonKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
    return false
  }
  if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set')
    return false
  }
  console.log('✅ All environment variables are set\n')

  // Test client connection
  console.log('🔌 Testing client connection (anon key)...')
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name, created_at')
      .limit(1)

    if (error) {
      console.error('❌ Client connection failed:', error.message)
      console.error('   Details:', error)
      return false
    }

    console.log('✅ Client connection successful')
    if (data && data.length > 0) {
      console.log('   Found organization:', data[0].name)
    } else {
      console.log('   No organizations found (this is normal for a new database)')
    }
  } catch (err) {
    console.error('❌ Client connection error:', err)
    return false
  }

  console.log('')

  // Test admin connection
  console.log('🔐 Testing admin connection (service role key)...')
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  try {
    const { data, error } = await supabaseAdmin
      .from('organizations')
      .select('id, name, created_at')
      .limit(1)

    if (error) {
      console.error('❌ Admin connection failed:', error.message)
      console.error('   Details:', error)
      return false
    }

    console.log('✅ Admin connection successful')
    if (data && data.length > 0) {
      console.log('   Found organization:', data[0].name)
    }
  } catch (err) {
    console.error('❌ Admin connection error:', err)
    return false
  }

  console.log('')

  // Test table existence
  console.log('📊 Checking database tables...')
  const tables = [
    'organizations',
    'user_profiles',
    'leads',
    'partners',
    'deals',
    'reports',
    'payment_sessions',
    'payment_transactions',
    'platform_settings',
  ]

  let allTablesExist = true
  for (const table of tables) {
    try {
      const { error } = await supabaseAdmin
        .from(table)
        .select('id')
        .limit(1)

      if (error) {
        console.error(`   ❌ Table '${table}' not found or not accessible`)
        allTablesExist = false
      } else {
        console.log(`   ✅ Table '${table}' exists`)
      }
    } catch (err) {
      console.error(`   ❌ Error checking table '${table}':`, err)
      allTablesExist = false
    }
  }

  console.log('')

  if (allTablesExist) {
    console.log('🎉 All tests passed! Your Supabase connection is working correctly.\n')
    return true
  } else {
    console.log('⚠️  Some tables are missing. Did you run the supabase-complete-schema.sql?\n')
    console.log('To set up the database:')
    console.log('1. Go to your Supabase project dashboard')
    console.log('2. Click on "SQL Editor" in the left sidebar')
    console.log('3. Click "New query"')
    console.log('4. Copy and paste the contents of supabase-complete-schema.sql')
    console.log('5. Click "Run" or press Ctrl/Cmd + Enter\n')
    return false
  }
}

// Run the test
testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('💥 Unexpected error:', error)
    process.exit(1)
  })

