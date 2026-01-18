# Implementation Guide - Quick Start

This guide provides specific implementation steps for the most critical components.

---

## 1. Database Setup with Supabase (Fastest Path)

### Step 1: Install Dependencies
```bash
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-nextjs
```

### Step 2: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy your project URL and anon key

### Step 3: Environment Variables
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 4: Create Supabase Client
```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Step 5: Database Schema (SQL)
```sql
-- Run in Supabase SQL Editor

-- Users table (handled by Supabase Auth)

-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partners table
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  industry TEXT,
  country TEXT,
  city TEXT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals table
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  commission_type TEXT NOT NULL,
  commission_value DECIMAL NOT NULL,
  price DECIMAL,
  payout_trigger TEXT NOT NULL,
  redemptions INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id),
  deal_id UUID REFERENCES deals(id),
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  website TEXT,
  industry TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  source TEXT NOT NULL,
  estimated_value DECIMAL,
  actual_value DECIMAL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies (example for partners)
CREATE POLICY "Users can view their organization's partners"
  ON partners FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id = partners.organization_id
  ));
```

---

## 2. Authentication with NextAuth.js

### Step 1: Install Dependencies
```bash
npm install next-auth@beta
npm install @auth/supabase-adapter
```

### Step 2: Create Auth Configuration
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Implement your auth logic here
        // Return user object or null
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id
      session.user.role = user.role
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
})

export { handlers as GET, handlers as POST }
```

### Step 3: Protect Routes
```typescript
// middleware.ts
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/api/:path*']
}
```

---

## 3. API Routes with Validation

### Step 1: Create Zod Schemas
```typescript
// lib/validators/partner.schema.ts
import { z } from 'zod'

export const createPartnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  industry: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  status: z.enum(['active', 'paused', 'archived']).default('active'),
  notes: z.string().optional(),
})

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>
```

### Step 2: Create API Route
```typescript
// app/api/partners/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { supabase } from '@/lib/supabase/client'
import { createPartnerSchema } from '@/lib/validators/partner.schema'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching partners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    // Validate input
    const validatedData = createPartnerSchema.parse(body)

    const { data, error } = await supabase
      .from('partners')
      .insert([validatedData])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating partner:', error)
    return NextResponse.json(
      { error: 'Failed to create partner' },
      { status: 500 }
    )
  }
}
```

### Step 3: Create Service Layer
```typescript
// lib/services/partner.service.ts
import { supabase } from '@/lib/supabase/client'
import { CreatePartnerInput } from '@/lib/validators/partner.schema'
import { Partner } from '@/lib/models/partner'

export class PartnerService {
  async getAll(): Promise<Partner[]> {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch partners: ${error.message}`)
    return data as Partner[]
  }

  async getById(id: string): Promise<Partner | null> {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to fetch partner: ${error.message}`)
    }

    return data as Partner
  }

  async create(input: CreatePartnerInput): Promise<Partner> {
    const { data, error } = await supabase
      .from('partners')
      .insert([input])
      .select()
      .single()

    if (error) throw new Error(`Failed to create partner: ${error.message}`)
    return data as Partner
  }

  async update(id: string, input: Partial<CreatePartnerInput>): Promise<Partner> {
    const { data, error } = await supabase
      .from('partners')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update partner: ${error.message}`)
    return data as Partner
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to delete partner: ${error.message}`)
  }
}

export const partnerService = new PartnerService()
```

---

## 4. Client-Side Data Fetching with SWR

### Step 1: Install SWR
```bash
npm install swr
```

### Step 2: Create API Client
```typescript
// lib/api/client.ts
export class ApiClient {
  private baseUrl = '/api'

  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`)
    if (!res.ok) throw new Error('API request failed')
    const json = await res.json()
    return json.data
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'API request failed')
    }
    const json = await res.json()
    return json.data
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('API request failed')
    const json = await res.json()
    return json.data
  }

  async delete(endpoint: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('API request failed')
  }
}

export const apiClient = new ApiClient()
```

### Step 3: Create Custom Hooks
```typescript
// lib/hooks/usePartners.ts
import useSWR from 'swr'
import { apiClient } from '@/lib/api/client'
import { Partner } from '@/lib/models/partner'

export function usePartners() {
  const { data, error, isLoading, mutate } = useSWR<Partner[]>(
    '/partners',
    () => apiClient.get('/partners')
  )

  return {
    partners: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export function usePartner(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Partner>(
    id ? `/partners/${id}` : null,
    () => apiClient.get(`/partners/${id}`)
  )

  return {
    partner: data,
    isLoading,
    isError: error,
    mutate,
  }
}
```

### Step 4: Use in Components
```typescript
// app/admin/partners/page.tsx
'use client'

import { usePartners } from '@/lib/hooks/usePartners'
import { apiClient } from '@/lib/api/client'

export default function PartnersPage() {
  const { partners, isLoading, isError, mutate } = usePartners()

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/partners/${id}`)
      mutate() // Refresh the list
    } catch (error) {
      console.error('Failed to delete partner:', error)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading partners</div>

  return (
    <div>
      {partners?.map(partner => (
        <div key={partner.id}>
          <h3>{partner.name}</h3>
          <button onClick={() => handleDelete(partner.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
```

---

## 5. Error Handling & Monitoring

### Step 1: Install Sentry
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Step 2: Create Error Boundary
```typescript
// components/error-boundary.tsx
'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <button
          onClick={reset}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
```

### Step 3: Add to Layout
```typescript
// app/error.tsx
export { default } from '@/components/error-boundary'
```

---

## 6. Environment Variables Setup

### Create .env.local
```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com

# AI
OPENAI_API_KEY=your-openai-api-key

# Payments
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# Monitoring
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### Create .env.example
```env
# Copy this to .env.local and fill in your values

# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Email
RESEND_API_KEY=
EMAIL_FROM=

# AI
OPENAI_API_KEY=

# Payments
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Monitoring
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

---

## 7. Quick Fixes for Current Issues

### Fix 1: Remove ignoreBuildErrors
```typescript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ REMOVE THIS:
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

### Fix 2: Update Partner Model
```typescript
// lib/models/partner.ts
export type PartnerStatus = "active" | "paused" | "archived"

export interface Partner {
  id: string
  organizationId?: string  // Add for multi-tenancy
  name: string
  companyName?: string
  email: string
  phone?: string
  website?: string
  industry?: string
  country?: string
  city?: string
  status: PartnerStatus
  notes?: string
  createdAt: string
  updatedAt: string
}
```

### Fix 3: Add Loading States
```typescript
// components/ui/loading.tsx
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}
```

---

## Next Steps

1. **This Week:**
   - Fix TypeScript configuration
   - Set up Supabase account
   - Create database schema
   - Set up environment variables

2. **Next Week:**
   - Implement authentication
   - Create first API routes
   - Replace mock data with real queries

3. **Week 3-4:**
   - Complete all CRUD operations
   - Add error handling
   - Set up monitoring

For detailed roadmap, see `PRODUCTION_READINESS_REPORT.md`
