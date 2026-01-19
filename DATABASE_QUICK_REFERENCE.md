# Database Quick Reference

Quick reference for common database operations in the Ignitia AI platform.

---

## 🔌 Connection Setup

```typescript
// Client-side (lib/supabase/client.ts)
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-side (lib/supabase/server.ts)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

---

## 📖 Common Queries

### Leads

```typescript
// Get all leads for an organization
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .eq('organization_id', orgId)
  .order('created_at', { ascending: false })

// Get lead by ID with relationships
const { data, error } = await supabase
  .from('leads')
  .select(`
    *,
    partner:partners(*),
    deal:deals(*),
    reports(*)
  `)
  .eq('id', leadId)
  .single()

// Create a new lead
const { data, error } = await supabase
  .from('leads')
  .insert({
    organization_id: orgId,
    email: 'john@example.com',
    name: 'John Doe',
    status: 'new',
    source: 'audit'
  })
  .select()
  .single()

// Update lead status
const { data, error } = await supabase
  .from('leads')
  .update({ status: 'converted', converted_at: new Date().toISOString() })
  .eq('id', leadId)
  .select()
  .single()

// Filter leads by status
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .eq('organization_id', orgId)
  .eq('status', 'new')
  .order('created_at', { ascending: false })

// Search leads by email or company
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .eq('organization_id', orgId)
  .or(`email.ilike.%${query}%,company.ilike.%${query}%`)
```

### Partners

```typescript
// Get all active partners
const { data, error } = await supabase
  .from('partners')
  .select('*')
  .eq('organization_id', orgId)
  .eq('status', 'active')

// Get partner with performance metrics
const { data, error } = await supabase
  .from('partner_performance')
  .select('*')
  .eq('organization_id', orgId)
  .eq('id', partnerId)
  .single()

// Create a new partner
const { data, error } = await supabase
  .from('partners')
  .insert({
    organization_id: orgId,
    name: 'Partner Name',
    email: 'partner@example.com',
    status: 'active'
  })
  .select()
  .single()
```

### Deals

```typescript
// Get all active deals for a partner
const { data, error } = await supabase
  .from('deals')
  .select('*')
  .eq('partner_id', partnerId)
  .eq('status', 'active')

// Create a new deal
const { data, error } = await supabase
  .from('deals')
  .insert({
    organization_id: orgId,
    partner_id: partnerId,
    name: 'Summer Campaign',
    commission_type: 'percentage',
    commission_value: 20,
    payout_trigger: 'sale',
    status: 'active'
  })
  .select()
  .single()
```

### Reports

```typescript
// Get all reports for a lead
const { data, error } = await supabase
  .from('reports')
  .select('*')
  .eq('lead_id', leadId)
  .order('created_at', { ascending: false })

// Create a new report
const { data, error } = await supabase
  .from('reports')
  .insert({
    organization_id: orgId,
    lead_id: leadId,
    business_name: 'Acme Corp',
    industry: 'Technology',
    type: 'snapshot',
    status: 'draft',
    ai_confidence_score: 85
  })
  .select()
  .single()

// Update report with AI analysis
const { data, error } = await supabase
  .from('reports')
  .update({
    status: 'generated',
    revenue_model: { /* JSONB data */ },
    bottlenecks: [ /* array */ ],
    recommendations: [ /* array */ ]
  })
  .eq('id', reportId)
  .select()
  .single()
```

### Payment Sessions

```typescript
// Create a payment session
const { data, error } = await supabase
  .from('payment_sessions')
  .insert({
    organization_id: orgId,
    lead_id: leadId,
    report_id: reportId,
    amount: 500.00,
    currency: 'USD',
    description: 'Growth Blueprint Report',
    ref_id: `${leadId}-${reportId}-${Date.now()}`,
    status: 'pending'
  })
  .select()
  .single()

// Get payment session by ref_id
const { data, error } = await supabase
  .from('payment_sessions')
  .select('*')
  .eq('ref_id', refId)
  .single()

// Update payment status
const { data, error } = await supabase
  .from('payment_sessions')
  .update({
    status: 'completed',
    completed_at: new Date().toISOString(),
    paxos_payment_id: 'pax_123456'
  })
  .eq('id', sessionId)
  .select()
  .single()
```

---

## 📊 Analytics Queries

```typescript
// Get partner performance
const { data, error } = await supabase
  .from('partner_performance')
  .select('*')
  .eq('organization_id', orgId)

// Get monthly revenue
const { data, error } = await supabase
  .from('monthly_revenue')
  .select('*')
  .eq('organization_id', orgId)
  .order('month', { ascending: false })
  .limit(12)

// Get lead funnel metrics
const { data, error } = await supabase
  .from('lead_funnel_metrics')
  .select('*')
  .eq('organization_id', orgId)

// Get report metrics
const { data, error } = await supabase
  .from('report_metrics')
  .select('*')
  .eq('organization_id', orgId)

// Get payment metrics
const { data, error } = await supabase
  .from('payment_metrics')
  .select('*')
  .eq('organization_id', orgId)
```

---

## 🔄 Real-time Subscriptions

```typescript
// Subscribe to new leads
const subscription = supabase
  .channel('leads')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'leads',
    filter: `organization_id=eq.${orgId}`
  }, (payload) => {
    console.log('New lead:', payload.new)
  })
  .subscribe()

// Subscribe to payment status changes
const subscription = supabase
  .channel('payments')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'payment_sessions',
    filter: `organization_id=eq.${orgId}`
  }, (payload) => {
    console.log('Payment updated:', payload.new)
  })
  .subscribe()

// Unsubscribe
subscription.unsubscribe()
```

---

## 🔍 Advanced Queries

```typescript
// Pagination
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .eq('organization_id', orgId)
  .range(0, 9) // First 10 results
  .order('created_at', { ascending: false })

// Count total records
const { count, error } = await supabase
  .from('leads')
  .select('*', { count: 'exact', head: true })
  .eq('organization_id', orgId)

// Complex filtering
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .eq('organization_id', orgId)
  .in('status', ['new', 'contacted'])
  .gte('created_at', '2024-01-01')
  .order('created_at', { ascending: false })

// Full-text search
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .textSearch('company', query)
```

---

## 🛡️ Error Handling

```typescript
async function safeQuery() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('organization_id', orgId)
    
    if (error) throw error
    
    return { success: true, data }
  } catch (error) {
    console.error('Database error:', error)
    return { success: false, error: error.message }
  }
}
```

---

## 🔐 RLS Bypass (Server-side only)

```typescript
// Use service role key to bypass RLS
import { supabaseAdmin } from '@/lib/supabase/server'

const { data, error } = await supabaseAdmin
  .from('leads')
  .select('*')
  // No organization_id filter needed
```

---

## 📝 Useful Tips

1. **Always filter by organization_id** for multi-tenant queries
2. **Use .single()** when expecting one result
3. **Use .select()** after INSERT/UPDATE to get the result
4. **Use views** for complex analytics queries
5. **Use real-time subscriptions** for live updates
6. **Handle errors** properly with try/catch
7. **Use service role** only on server-side
8. **Test RLS policies** with different user roles

---

For more details, see:
- **DATABASE_SETUP.md** - Setup instructions
- **MIGRATION_GUIDE.md** - Migration examples
- **Supabase Docs** - [supabase.com/docs](https://supabase.com/docs)

