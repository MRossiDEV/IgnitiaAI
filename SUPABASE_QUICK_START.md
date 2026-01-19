# 🚀 Supabase Quick Start (15 Minutes)

Follow these steps to get your Supabase database up and running.

---

## ✅ Prerequisites (Already Done!)

- [x] Supabase packages installed
- [x] Client files created (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
- [x] Test script ready (`scripts/test-supabase-connection.ts`)
- [x] Environment template created (`.env.local.example`)

---

## 📝 Setup Steps

### ☐ Step 1: Create Supabase Project (5 min)

1. Go to **[supabase.com](https://supabase.com)** → Sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: `ignitia-ai`
   - **Password**: (strong password - save it!)
   - **Region**: (closest to you)
4. Click **"Create new project"**
5. ⏳ Wait 2-3 minutes

---

### ☐ Step 2: Run Database Schema (3 min)

1. In Supabase dashboard → **"SQL Editor"**
2. Click **"New query"**
3. Open `supabase-complete-schema.sql`
4. Copy all contents → Paste in SQL Editor
5. Click **"Run"** (or `Ctrl/Cmd + Enter`)
6. ✅ See "Success. No rows returned"

---

### ☐ Step 3: Get API Keys (2 min)

1. In Supabase → **"Settings"** → **"API"**
2. Copy these 3 values:
   - ✅ **Project URL**
   - ✅ **anon public** key
   - ✅ **service_role** key

---

### ☐ Step 4: Configure Environment (3 min)

1. **Copy template:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`** and paste your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

3. **Save** the file

---

### ☐ Step 5: Test Connection (2 min)

Run:
```bash
npm run test:db
```

Expected output:
```
🎉 All tests passed! Your Supabase connection is working correctly.
```

---

## 🎉 Done!

You're ready to use Supabase in your app!

---

## 📖 Quick Usage

### In React Components:
```typescript
import { supabase } from '@/lib/supabase/client'

const { data } = await supabase.from('leads').select('*')
```

### In API Routes:
```typescript
import { supabaseAdmin } from '@/lib/supabase/server'

const { data } = await supabaseAdmin.from('leads').insert({...})
```

---

## 📚 More Help

- **Full Guide**: [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)
- **Usage Examples**: [lib/supabase/README.md](./lib/supabase/README.md)
- **Database Queries**: [DATABASE_QUICK_REFERENCE.md](./DATABASE_QUICK_REFERENCE.md)

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Missing environment variables" | Create `.env.local` with your keys |
| "relation does not exist" | Run `supabase-complete-schema.sql` |
| "permission denied" | Use `supabaseAdmin` in API routes |
| Test fails | Check API keys are correct |

---

**Need help?** Check [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) for detailed instructions.

