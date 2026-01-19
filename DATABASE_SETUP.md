# Ignitia AI - Database Setup Guide

This guide will walk you through setting up the complete Supabase database for the Ignitia AI platform.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Database Schema Overview](#database-schema-overview)
- [Environment Variables](#environment-variables)
- [Testing the Setup](#testing-the-setup)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have:

1. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
2. **Node.js** - Version 18 or higher
3. **Git** - For version control

---

## Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `ignitia-ai` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Start with the free tier
4. Click **"Create new project"**
5. Wait for the project to be provisioned (2-3 minutes)

### 2. Run the Database Schema

1. In your Supabase project dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the `supabase-complete-schema.sql` file from this repository
4. Copy the entire contents and paste it into the SQL Editor
5. Click **"Run"** (or press `Ctrl/Cmd + Enter`)
6. Wait for the schema to be created (this may take 30-60 seconds)
7. You should see a success message: "Success. No rows returned"

### 3. Get Your API Keys

1. In your Supabase project, click on **"Settings"** (gear icon) in the left sidebar
2. Click on **"API"** under Project Settings
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - keep this secret!)

### 4. Configure Environment Variables

1. In your project root, create a `.env.local` file (if it doesn't exist)
2. Add the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database URL (optional - for migrations)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

3. Replace the placeholder values with your actual Supabase credentials
4. **Important**: Never commit `.env.local` to version control!

---

## Detailed Setup

### Database Schema Overview

The complete schema includes the following tables:

#### Core Tables
- **organizations** - Multi-tenant organization accounts
- **user_profiles** - Extended user data (linked to Supabase auth)
- **partners** - Partner/affiliate accounts
- **deals** - Partner deals and commission structures
- **leads** - Lead capture and tracking
- **reports** - AI-generated business reports

#### Payment Tables
- **payment_sessions** - Payment session tracking (Paxum/Paxos)
- **payment_transactions** - Detailed transaction records
- **webhook_events** - Payment webhook event logs

#### Settings Tables
- **platform_settings** - Platform configuration
- **ai_templates** - AI prompt templates
- **report_configurations** - Report generation settings
- **industry_settings** - Industry-specific configurations
- **payment_settings** - Payment gateway settings
- **discount_codes** - Promotional discount codes
- **integration_settings** - Third-party integrations
- **automation_rules** - Workflow automation rules
- **funnel_templates** - Reusable funnel templates
- **system_settings** - System-level settings

#### Funnel Tables
- **funnels** - Marketing funnels
- **funnel_steps** - Individual funnel steps

#### Subscription Tables
- **subscriptions** - Stripe subscription data
- **invoices** - Invoice records

#### System Tables
- **api_keys** - API key management
- **webhooks** - Webhook configurations
- **audit_logs** - Audit trail
- **analytics_events** - Analytics tracking

### Features Included

✅ **Row Level Security (RLS)** - Multi-tenant data isolation  
✅ **Indexes** - Optimized for common queries  
✅ **Triggers** - Auto-update timestamps  
✅ **Views** - Pre-built analytics queries  
✅ **Seed Data** - Demo organization for testing  
✅ **Comments** - Documentation for each table  

---

## Environment Variables

### Required Variables

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Optional Variables

```env
# Authentication (NextAuth.js)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Email Service (Resend)
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@yourdomain.com

# AI (OpenAI)
OPENAI_API_KEY=sk-xxxxx

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Payments (Paxum)
PAXUM_API_KEY=your-paxum-key
PAXUM_EMAIL=your-paxum-email

# Monitoring (Sentry)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

---

## Testing the Setup

### 1. Verify Tables Were Created

1. In Supabase, go to **"Table Editor"**
2. You should see all 30+ tables listed
3. Click on a few tables to verify they have the correct columns

### 2. Check Row Level Security

1. Go to **"Authentication"** > **"Policies"**
2. You should see RLS policies for each table
3. Verify that policies are enabled

### 3. Test the Connection

Create a simple test file `test-db-connection.js`:

```javascript
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testConnection() {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('❌ Connection failed:', error)
  } else {
    console.log('✅ Connection successful!')
    console.log('Data:', data)
  }
}

testConnection()
```

Run it:
```bash
node test-db-connection.js
```

---

## Troubleshooting

### Common Issues

#### Issue: "relation does not exist"
**Solution**: Make sure you ran the complete schema SQL file in the SQL Editor.

#### Issue: "permission denied for table"
**Solution**: Check that RLS policies are correctly set up. You may need to authenticate first.

#### Issue: "connection refused"
**Solution**: Verify your `NEXT_PUBLIC_SUPABASE_URL` is correct and the project is active.

#### Issue: "invalid API key"
**Solution**: Double-check your API keys in the Supabase dashboard under Settings > API.

### Getting Help

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Supabase Discord**: [discord.supabase.com](https://discord.supabase.com)
- **GitHub Issues**: Create an issue in this repository

---

## Next Steps

After setting up the database:

1. ✅ Install Supabase client library
2. ✅ Set up authentication (NextAuth.js or Supabase Auth)
3. ✅ Create API routes to interact with the database
4. ✅ Replace mock data with real database queries
5. ✅ Test all CRUD operations
6. ✅ Set up database backups
7. ✅ Configure monitoring and alerts

---

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Use service_role key** only on the server side
3. **Enable RLS** on all tables (already done in schema)
4. **Rotate API keys** regularly
5. **Use prepared statements** to prevent SQL injection
6. **Enable 2FA** on your Supabase account
7. **Set up database backups** (automatic in Supabase Pro)
8. **Monitor audit logs** for suspicious activity

---

## Database Maintenance

### Backups

Supabase automatically backs up your database:
- **Free tier**: Daily backups (7-day retention)
- **Pro tier**: Daily backups (30-day retention) + Point-in-time recovery

### Migrations

For future schema changes, use Supabase migrations:

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize migrations
supabase init

# Create a new migration
supabase migration new add_new_feature

# Apply migrations
supabase db push
```

---

## Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the Supabase documentation
3. Open an issue in this repository
4. Contact the development team

---

**🎉 Congratulations!** Your database is now set up and ready to use!

