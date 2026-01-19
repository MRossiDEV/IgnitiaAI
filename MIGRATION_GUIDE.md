# Migration Guide - From Mock Data to Supabase

This guide will help you migrate from the current mock data implementation to the Supabase database.

## 📋 Overview

The platform currently uses mock data stored in:
- `lib/mock/leads.ts`
- `lib/mock/partners.ts`
- `lib/mock/deals.ts`
- `lib/mock/reports.ts`
- `lib/mock/funnels.ts`

This guide will help you replace these with real database queries.

---

## Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

---

## Step 2: Create Supabase Client

Create `lib/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Create `lib/supabase/server.ts` for server-side operations:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
```

---

## Step 3: Create Database Service Layer

Create `lib/services/leads.ts`:

```typescript
import { supabase } from '@/lib/supabase/client'
import { Lead } from '@/lib/models/lead'

export async function getLeads(organizationId: string): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Lead[]
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Lead
}

export async function createLead(lead: Partial<Lead>): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single()

  if (error) throw error
  return data as Lead
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Lead
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) throw error
}
```

Create similar files for:
- `lib/services/partners.ts`
- `lib/services/deals.ts`
- `lib/services/reports.ts`
- `lib/services/funnels.ts`

---

## Step 4: Update Type Definitions

Update `lib/models/lead.ts` to match database schema:

```typescript
export interface Lead {
  id: string
  organization_id: string
  partner_id?: string
  deal_id?: string
  
  // Lead identity
  name?: string
  email: string
  phone?: string
  company?: string
  website?: string
  industry?: string
  message?: string
  
  // Tracking
  status: LeadStatus
  source: LeadSource
  priority?: LeadPriority
  
  // UTM tracking
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  
  // Revenue tracking
  estimated_value?: number
  actual_value?: number
  
  // Notes and metadata
  notes?: string
  metadata?: Record<string, any>
  
  // Timestamps
  created_at: string
  updated_at: string
  converted_at?: string
  last_contacted_at?: string
  next_follow_up_at?: string
  
  assigned_to?: string
}
```

---

## Step 5: Update Pages to Use Database

### Example: Update Leads Page

Before (using mock data):
```typescript
import { leads as mockLeads } from "@/lib/mock/leads"

export default function LeadsPage() {
  const [leads] = useState(mockLeads)
  // ...
}
```

After (using database):
```typescript
import { getLeads } from "@/lib/services/leads"
import { useEffect, useState } from "react"

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchLeads() {
      try {
        const organizationId = "your-org-id" // Get from auth context
        const data = await getLeads(organizationId)
        setLeads(data)
      } catch (error) {
        console.error('Error fetching leads:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchLeads()
  }, [])
  
  if (loading) return <div>Loading...</div>
  
  // ...
}
```

---

## Step 6: Create API Routes

Create `app/api/leads/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    
    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID required' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert(body)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Step 7: Migration Checklist

### Phase 1: Setup (Week 1)
- [ ] Create Supabase project
- [ ] Run database schema
- [ ] Set up environment variables
- [ ] Install dependencies
- [ ] Create Supabase client utilities

### Phase 2: Service Layer (Week 2)
- [ ] Create service layer for leads
- [ ] Create service layer for partners
- [ ] Create service layer for deals
- [ ] Create service layer for reports
- [ ] Create service layer for payments
- [ ] Create service layer for funnels

### Phase 3: API Routes (Week 3)
- [ ] Create API routes for leads
- [ ] Create API routes for partners
- [ ] Create API routes for deals
- [ ] Create API routes for reports
- [ ] Create API routes for payments
- [ ] Add authentication middleware
- [ ] Add validation middleware

### Phase 4: Frontend Migration (Week 4)
- [ ] Update leads page
- [ ] Update partners page
- [ ] Update deals page
- [ ] Update reports page
- [ ] Update dashboard
- [ ] Update settings pages
- [ ] Add loading states
- [ ] Add error handling

### Phase 5: Testing (Week 5)
- [ ] Test CRUD operations for all entities
- [ ] Test RLS policies
- [ ] Test authentication flow
- [ ] Test payment integration
- [ ] Test report generation
- [ ] Performance testing
- [ ] Security audit

### Phase 6: Deployment (Week 6)
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Run migrations
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Set up backups

---

## Common Patterns

### Pattern 1: Fetching with Relationships

```typescript
// Fetch leads with partner and deal information
const { data, error } = await supabase
  .from('leads')
  .select(`
    *,
    partner:partners(*),
    deal:deals(*)
  `)
  .eq('organization_id', organizationId)
```

### Pattern 2: Filtering and Pagination

```typescript
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .eq('organization_id', organizationId)
  .eq('status', 'new')
  .range(0, 9) // First 10 results
  .order('created_at', { ascending: false })
```

### Pattern 3: Real-time Subscriptions

```typescript
const subscription = supabase
  .channel('leads')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'leads',
    filter: `organization_id=eq.${organizationId}`
  }, (payload) => {
    console.log('Change received!', payload)
    // Update UI
  })
  .subscribe()
```

---

## Troubleshooting

### Issue: RLS blocking queries
**Solution**: Make sure you're authenticated and the user has the correct organization_id in their profile.

### Issue: Type mismatches
**Solution**: Update your TypeScript interfaces to match the database schema exactly.

### Issue: Slow queries
**Solution**: Check that indexes are created on frequently queried columns.

---

## Next Steps

After migration:
1. Remove mock data files
2. Update tests to use database
3. Set up database backups
4. Configure monitoring
5. Optimize queries
6. Add caching layer (Redis)

---

**Need Help?** Check the DATABASE_SETUP.md guide or open an issue.

