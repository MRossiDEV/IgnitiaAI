# Supabase Client Usage Guide

Quick reference for using Supabase in the Ignitia AI codebase.

---

## 📁 Files

- **`client.ts`** - Client-side Supabase client (uses anon key, respects RLS)
- **`server.ts`** - Server-side Supabase admin client (uses service role key, bypasses RLS)
- **`types.ts`** - TypeScript types for database tables

---

## 🔌 When to Use Which Client

### Use `client.ts` for:
- ✅ Client-side React components
- ✅ Client-side data fetching
- ✅ User-specific queries (respects RLS)
- ✅ Real-time subscriptions

### Use `server.ts` for:
- ✅ API routes (`app/api/**/route.ts`)
- ✅ Server components
- ✅ Admin operations
- ✅ Bypassing RLS for system operations

---

## 📖 Usage Examples

### Client-Side (React Components)

```typescript
import { supabase } from '@/lib/supabase/client'

export default function LeadsPage() {
  const [leads, setLeads] = useState([])

  useEffect(() => {
    async function fetchLeads() {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching leads:', error)
        return
      }

      setLeads(data)
    }

    fetchLeads()
  }, [])

  return <div>{/* Render leads */}</div>
}
```

### Server-Side (API Routes)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Insert lead into database
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({
        organization_id: body.organizationId,
        email: body.email,
        full_name: body.fullName,
        company: body.company,
        status: 'new',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
```

---

## 🔍 Common Queries

### Select

```typescript
// Get all records
const { data, error } = await supabase
  .from('leads')
  .select('*')

// Get specific columns
const { data, error } = await supabase
  .from('leads')
  .select('id, email, full_name')

// Get with filter
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .eq('status', 'new')
  .order('created_at', { ascending: false })
```

### Insert

```typescript
// Insert single record
const { data, error } = await supabase
  .from('leads')
  .insert({ email: 'test@example.com', status: 'new' })
  .select()
  .single()

// Insert multiple records
const { data, error } = await supabase
  .from('leads')
  .insert([
    { email: 'test1@example.com' },
    { email: 'test2@example.com' },
  ])
  .select()
```

### Update

```typescript
// Update record
const { data, error } = await supabase
  .from('leads')
  .update({ status: 'contacted' })
  .eq('id', leadId)
  .select()
  .single()
```

### Delete

```typescript
// Delete record
const { error } = await supabase
  .from('leads')
  .delete()
  .eq('id', leadId)
```

---

## 🛡️ Error Handling

Always check for errors:

```typescript
const { data, error } = await supabase
  .from('leads')
  .select('*')

if (error) {
  console.error('Database error:', error)
  // Handle error appropriately
  return
}

// Use data safely
console.log(data)
```

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled. The policies are:

- **Client (`supabase`)**: Respects RLS, users can only access their organization's data
- **Admin (`supabaseAdmin`)**: Bypasses RLS, can access all data

---

## 📚 More Information

- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript)
- [DATABASE_QUICK_REFERENCE.md](../../DATABASE_QUICK_REFERENCE.md)
- [SUPABASE_SETUP_GUIDE.md](../../SUPABASE_SETUP_GUIDE.md)

