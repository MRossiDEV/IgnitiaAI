# 🚀 Supabase Setup Guide

This guide will help you set up Supabase for the Ignitia AI landing page in **under 15 minutes**.

---

## ✅ Prerequisites

- [x] Node.js 18+ installed
- [x] Supabase packages installed (`@supabase/supabase-js`)
- [x] Supabase client files created (`lib/supabase/client.ts`, `lib/supabase/server.ts`)

---

## 📝 Step-by-Step Setup

### Step 1: Create a Supabase Project (5 minutes)

1. **Go to [supabase.com](https://supabase.com)** and sign in (or create an account)

2. **Click "New Project"**

3. **Fill in the project details:**
   - **Name**: `ignitia-ai` (or your preferred name)
   - **Database Password**: Choose a strong password and **save it somewhere safe!**
   - **Region**: Choose the closest region to your users (e.g., `us-east-1`, `eu-west-1`)
   - **Pricing Plan**: Free tier is fine for development

4. **Click "Create new project"**

5. **Wait 2-3 minutes** for the project to be provisioned ☕

---

### Step 2: Run the Database Schema (3 minutes)

1. **In your Supabase dashboard**, click **"SQL Editor"** in the left sidebar

2. **Click "New query"**

3. **Open the file** `supabase-complete-schema.sql` from this repository

4. **Copy the entire contents** and paste it into the SQL Editor

5. **Click "Run"** (or press `Ctrl/Cmd + Enter`)

6. **Wait 30-60 seconds** for the schema to be created

7. **You should see**: "Success. No rows returned"

✅ Your database is now set up with all tables, indexes, and Row Level Security policies!

---

### Step 3: Get Your API Keys (2 minutes)

1. **In your Supabase dashboard**, click **"Settings"** (gear icon) in the left sidebar

2. **Click "API"** under Project Settings

3. **Copy the following values:**

   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - ⚠️ keep this secret!)

---

### Step 4: Configure Environment Variables (3 minutes)

1. **Copy the example file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Open `.env.local`** in your editor

3. **Replace the placeholder values** with your actual Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
   ```

4. **Save the file**

⚠️ **Important**: Never commit `.env.local` to version control! (It's already in `.gitignore`)

---

### Step 5: Test the Connection (2 minutes)

1. **Install tsx** (if not already installed):
   ```bash
   npm install -D tsx
   ```

2. **Run the test script:**
   ```bash
   npx tsx scripts/test-supabase-connection.ts
   ```

3. **You should see:**
   ```
   🔍 Testing Supabase Connection...
   
   📋 Checking environment variables...
   ✅ All environment variables are set
   
   🔌 Testing client connection (anon key)...
   ✅ Client connection successful
   
   🔐 Testing admin connection (service role key)...
   ✅ Admin connection successful
   
   📊 Checking database tables...
      ✅ Table 'organizations' exists
      ✅ Table 'user_profiles' exists
      ✅ Table 'leads' exists
      ...
   
   🎉 All tests passed! Your Supabase connection is working correctly.
   ```

---

## 🎉 You're Done!

Your Supabase connection is now set up and ready to use!

---

## 📚 Next Steps

### 1. Start Using Supabase in Your Code

**Client-side (React components):**
```typescript
import { supabase } from '@/lib/supabase/client'

// Fetch data
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .eq('organization_id', orgId)
```

**Server-side (API routes):**
```typescript
import { supabaseAdmin } from '@/lib/supabase/server'

// Insert data (bypasses RLS)
const { data, error } = await supabaseAdmin
  .from('leads')
  .insert({ email: 'test@example.com', ... })
```

### 2. Replace Mock Data

See `MIGRATION_GUIDE.md` for detailed instructions on replacing mock data with real database queries.

### 3. Set Up Authentication

See `DATABASE_SETUP.md` for authentication setup instructions.

---

## 🔧 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: Make sure you created `.env.local` and added all required variables.

### Issue: "relation does not exist"

**Solution**: Run the `supabase-complete-schema.sql` file in the Supabase SQL Editor.

### Issue: "permission denied for table"

**Solution**: Check that Row Level Security policies are set up correctly. Use `supabaseAdmin` for server-side operations.

### Issue: Connection test fails

**Solution**: 
1. Verify your API keys are correct
2. Check that your Supabase project is active
3. Make sure you're using the correct project URL

---

## 📖 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Detailed database setup guide
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migrate from mock data to Supabase
- [DATABASE_QUICK_REFERENCE.md](./DATABASE_QUICK_REFERENCE.md) - Common queries

---

## 🔐 Security Best Practices

1. ✅ Never commit `.env.local` to version control
2. ✅ Use `SUPABASE_SERVICE_ROLE_KEY` only on the server side
3. ✅ Enable Row Level Security (RLS) on all tables (already done in schema)
4. ✅ Rotate API keys regularly
5. ✅ Enable 2FA on your Supabase account
6. ✅ Monitor audit logs for suspicious activity

---

**Need help?** Check the troubleshooting section or open an issue in the repository.

