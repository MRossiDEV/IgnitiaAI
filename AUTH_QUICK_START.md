# Authentication Quick Start

## 🚀 Get Started in 5 Minutes

### Step 1: Configure Environment Variables

Make sure your `.env.local` file has these variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 2: Enable Google OAuth (Optional)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Enable **Google**
5. Add your Google OAuth credentials
6. Add callback URL: `https://your-project.supabase.co/auth/v1/callback`

### Step 3: Run the Development Server

```bash
npm run dev
```

### Step 4: Test the Authentication

#### Create a Test User

1. Go to `http://localhost:3000/signup`
2. Fill in the form:
   - Full Name: `Test Admin`
   - Email: `admin@test.com`
   - Password: `password123`
   - Account Type: `Admin`
3. Click **Create Account**
4. Check your email for verification (if enabled)

#### Login

1. Go to `http://localhost:3000/login`
2. Enter credentials:
   - Email: `admin@test.com`
   - Password: `password123`
3. Click **Sign In**
4. You'll be redirected to `/admin` (admin dashboard)

#### Test Google OAuth

1. Go to `http://localhost:3000/login`
2. Click **Sign in with Google**
3. Select your Google account
4. You'll be redirected based on your role

## 📋 Available Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Registration page
- `/forgot-password` - Password reset

### Protected Routes (by Role)

#### Admin Routes (admin, super_admin)
- `/admin` - Admin dashboard
- `/admin/leads` - Leads management
- `/admin/audits` - Audits & reports
- `/admin/payments` - Payments
- `/admin/settings` - Settings

#### Partner Routes (partner)
- `/partner` - Partner dashboard

#### User Routes (user)
- `/dashboard` - User dashboard

## 🧪 Testing Different Roles

Create test users with different roles:

```typescript
// In browser console or test script

// Admin
await signUpWithEmail('admin@test.com', 'password123', 'Admin User', 'admin')

// Partner
await signUpWithEmail('partner@test.com', 'password123', 'Partner User', 'partner')

// User
await signUpWithEmail('user@test.com', 'password123', 'Regular User', 'user')
```

Then login with each account to see different dashboards.

## 🔐 Role-Based Access

| Role | Access |
|------|--------|
| **super_admin** | Full platform access, all admin features |
| **admin** | Admin panel, organization management |
| **partner** | Partner portal, referral tracking |
| **user** | User dashboard, personal reports |
| **api_user** | API access only (no UI) |

## 🛠️ Common Issues

### Issue: "Missing Supabase environment variables"
**Solution:** Check your `.env.local` file has all required variables

### Issue: Google OAuth not working
**Solution:** 
1. Verify Google provider is enabled in Supabase
2. Check redirect URLs match
3. Ensure Google OAuth credentials are correct

### Issue: Redirect loop after login
**Solution:**
1. Clear browser cookies
2. Check middleware configuration
3. Verify user profile exists in database

### Issue: "Access Denied" after login
**Solution:**
1. Check user role in database
2. Verify middleware role checks
3. Ensure user profile was created correctly

## 📝 Manual Database Setup

If user profiles aren't being created automatically, run this in Supabase SQL Editor:

```sql
-- Check if user_profiles table exists
SELECT * FROM user_profiles;

-- If empty, manually create a profile for your user
INSERT INTO user_profiles (id, email, full_name, role, status)
VALUES (
  'your-user-id-from-auth-users',
  'admin@test.com',
  'Admin User',
  'admin',
  'active'
);
```

## 🎯 Next Steps

1. ✅ Test login with email/password
2. ✅ Test Google OAuth (if configured)
3. ✅ Test role-based redirects
4. ✅ Test protected routes
5. ✅ Test logout functionality
6. ✅ Customize dashboards for each role
7. ✅ Add email verification
8. ✅ Implement password reset flow

## 📚 Additional Resources

- [AUTH_SETUP.md](./AUTH_SETUP.md) - Detailed setup guide
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## 🆘 Need Help?

Check the browser console for errors and verify:
1. Environment variables are set correctly
2. Supabase project is running
3. Database schema is up to date
4. User profile was created after signup

