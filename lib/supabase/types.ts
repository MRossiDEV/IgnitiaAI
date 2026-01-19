/**
 * Supabase Database Types
 * 
 * This file contains TypeScript types for the Supabase database schema.
 * These types match the tables defined in supabase-complete-schema.sql
 * 
 * To auto-generate these types from your Supabase database:
 *   npx supabase gen types typescript --project-id your-project-id > lib/supabase/types.ts
 */

// ============================================================================
// CORE TABLES
// ============================================================================

export interface Organization {
  id: string
  name: string
  slug: string
  industry?: string
  website?: string
  logo_url?: string
  settings?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  organization_id?: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'super_admin' | 'admin' | 'partner' | 'user' | 'api_user'
  status: 'active' | 'inactive' | 'suspended'
  last_login_at?: string
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  organization_id: string
  email: string
  full_name?: string
  company?: string
  phone?: string
  industry?: string
  website?: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  source?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Partner {
  id: string
  organization_id: string
  name: string
  email: string
  company?: string
  status: 'active' | 'inactive' | 'pending'
  commission_rate?: number
  total_revenue?: number
  created_at: string
  updated_at: string
}

export interface Deal {
  id: string
  organization_id: string
  partner_id?: string
  lead_id?: string
  title: string
  amount: number
  currency: string
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled'
  close_date?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  organization_id: string
  lead_id?: string
  title: string
  report_type: 'market_analysis' | 'competitor_analysis' | 'business_plan' | 'custom'
  content?: Record<string, any>
  status: 'generating' | 'completed' | 'failed'
  generated_at?: string
  created_at: string
  updated_at: string
}

// ============================================================================
// PAYMENT TABLES
// ============================================================================

export interface PaymentSession {
  id: string
  organization_id: string
  lead_id?: string
  amount: number
  currency: string
  payment_method: 'paxum' | 'paxos' | 'stripe' | 'crypto'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'expired'
  paxos_payment_id?: string
  payment_url?: string
  ref_id?: string
  expires_at?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface PaymentTransaction {
  id: string
  payment_session_id: string
  organization_id: string
  transaction_id?: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: string
  metadata?: Record<string, any>
  completed_at?: string
  created_at: string
  updated_at: string
}

// ============================================================================
// SETTINGS TABLES
// ============================================================================

export interface PlatformSettings {
  id: string
  organization_id: string
  platform_name: string
  default_currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'
  timezone: string
  business_verticals: string[]
  logo_url?: string
  email_sender: string
  report_footer_text: string
  created_at: string
  updated_at: string
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export type Database = {
  public: {
    Tables: {
      organizations: { Row: Organization }
      user_profiles: { Row: UserProfile }
      leads: { Row: Lead }
      partners: { Row: Partner }
      deals: { Row: Deal }
      reports: { Row: Report }
      payment_sessions: { Row: PaymentSession }
      payment_transactions: { Row: PaymentTransaction }
      platform_settings: { Row: PlatformSettings }
    }
  }
}

