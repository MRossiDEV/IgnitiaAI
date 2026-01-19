# Authentication Setup Guide

This guide explains how to set up and use the authentication system in Ignitia AI.

## Overview

The authentication system uses **Supabase Auth** with support for:
- ✅ Email/Password authentication
- ✅ Google OAuth
- ✅ Role-based access control (RBAC)
- ✅ Protected routes with middleware
- ✅ Automatic role-based redirects

## User Roles

The system supports 5 user roles:

1. **super_admin** - Full platform access, can manage everything
2. **admin** - Organization admin, access to admin panel
3. **partner** - Partner portal access, referral tracking
4. **user** - Standard user, access to personal dashboard
5. **api_user** - Programmatic API access only

## Setup Instructions

### 1. Configure Supabase

Make sure you have the following environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 2. Enable Google OAuth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Google** provider
4. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
5. Add authorized redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### 3. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `https://your-project-id.supabase.co/auth/v1/callback`
7. Copy Client ID and Client Secret to Supabase

### 4. Database Schema

The authentication system requires the `user_profiles` table. Run this SQL in Supabase:

```sql
-- User profiles table (should already exist from supabase-complete-schema.sql)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'partner', 'user', 'api_user')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (id = auth.uid());
```

## Usage

### Using the Auth Hook

```typescript
import { useAuth } from '@/hooks/use-auth'

function MyComponent() {
  const { user, loading, signOut, isAdmin, hasRole } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <p>Welcome, {user?.profile?.full_name}</p>
      <p>Role: {user?.profile?.role}</p>
      
      {isAdmin() && <AdminPanel />}
      {hasRole('partner') && <PartnerDashboard />}
      
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Authentication Functions

```typescript
import { 
  signUpWithEmail, 
  signInWithEmail, 
  signInWithGoogle,
  signOut,
  getCurrentUser 
} from '@/lib/auth/supabase-auth'

// Sign up
await signUpWithEmail('user@example.com', 'password', 'John Doe', 'user')

// Sign in
await signInWithEmail('user@example.com', 'password')

// Google OAuth
await signInWithGoogle()

// Sign out
await signOut()

// Get current user
const user = await getCurrentUser()
```

## Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Registration page
- `/forgot-password` - Password reset
- `/wizard` - Audit wizard
- `/auth/callback` - OAuth callback

### Protected Routes
- `/dashboard` - User dashboard (role: user)
- `/partner` - Partner portal (role: partner)
- `/admin/*` - Admin panel (role: admin, super_admin)

### Special Routes
- `/unauthorized` - Access denied page

## Role-Based Redirects

After login, users are automatically redirected based on their role:

- **super_admin** → `/admin`
- **admin** → `/admin`
- **partner** → `/partner`
- **user** → `/dashboard`

## Middleware Protection

The `middleware.ts` file automatically:
- Redirects unauthenticated users to `/login`
- Checks user roles for protected routes
- Redirects to `/unauthorized` if role doesn't match
- Prevents authenticated users from accessing `/login` and `/signup`

## Testing

### Create Test Users

You can create test users with different roles:

```typescript
// Admin user
await signUpWithEmail('admin@test.com', 'password123', 'Admin User', 'admin')

// Partner user
await signUpWithEmail('partner@test.com', 'password123', 'Partner User', 'partner')

// Regular user
await signUpWithEmail('user@test.com', 'password123', 'Regular User', 'user')
```

## Troubleshooting

### Google OAuth not working
- Check redirect URLs in Google Cloud Console
- Verify Supabase callback URL is correct
- Ensure Google provider is enabled in Supabase

### User profile not created
- Check if `user_profiles` table exists
- Verify RLS policies are set correctly
- Check browser console for errors

### Middleware redirect loop
- Clear browser cookies
- Check middleware matcher configuration
- Verify public routes are correctly defined

## Security Best Practices

1. ✅ Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client
2. ✅ Always use RLS policies on database tables
3. ✅ Validate user roles on both client and server
4. ✅ Use HTTPS in production
5. ✅ Enable email verification for production
6. ✅ Implement rate limiting for auth endpoints
7. ✅ Use strong password requirements

## Next Steps

- [ ] Enable email verification in Supabase
- [ ] Add 2FA/MFA support
- [ ] Implement password strength requirements
- [ ] Add rate limiting
- [ ] Set up email templates
- [ ] Add social login providers (GitHub, Microsoft, etc.)
- [ ] Implement session management
- [ ] Add audit logging for auth events

