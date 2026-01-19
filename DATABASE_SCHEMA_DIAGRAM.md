# Database Schema Diagram

This document provides a visual overview of the Ignitia AI database schema and table relationships.

## Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         IGNITIA AI DATABASE SCHEMA                       │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  organizations   │ ◄─────────────────┐
│  (Multi-tenant)  │                   │
└────────┬─────────┘                   │
         │                             │
         │ 1:N                         │
         ▼                             │
┌──────────────────┐                   │
│  user_profiles   │                   │
│  (Auth users)    │                   │
└──────────────────┘                   │
                                       │
         ┌─────────────────────────────┤
         │                             │
         │ 1:N                         │
         ▼                             │
┌──────────────────┐                   │
│    partners      │                   │
│  (Affiliates)    │                   │
└────────┬─────────┘                   │
         │                             │
         │ 1:N                         │
         ▼                             │
┌──────────────────┐                   │
│      deals       │                   │
│  (Commissions)   │                   │
└────────┬─────────┘                   │
         │                             │
         │ 1:N                         │
         ▼                             │
┌──────────────────┐                   │
│      leads       │ ──────────────────┤
│  (Prospects)     │                   │
└────────┬─────────┘                   │
         │                             │
         │ 1:N                         │
         ▼                             │
┌──────────────────┐                   │
│     reports      │ ──────────────────┤
│  (AI Reports)    │                   │
└────────┬─────────┘                   │
         │                             │
         │ 1:N                         │
         ▼                             │
┌──────────────────┐                   │
│ payment_sessions │ ──────────────────┤
│   (Payments)     │                   │
└────────┬─────────┘                   │
         │                             │
         │ 1:N                         │
         ▼                             │
┌──────────────────┐                   │
│payment_transactions                  │
│  (Paxos Data)    │                   │
└──────────────────┘                   │
                                       │
┌──────────────────┐                   │
│     funnels      │ ──────────────────┤
│  (Marketing)     │                   │
└────────┬─────────┘                   │
         │                             │
         │ 1:N                         │
         ▼                             │
┌──────────────────┐                   │
│  funnel_steps    │                   │
└──────────────────┘                   │
                                       │
┌──────────────────┐                   │
│ Settings Tables  │ ──────────────────┘
│  (Configuration) │
└──────────────────┘
```

## Core Tables

### 1. Organizations (Multi-tenancy)
```
organizations
├── id (PK)
├── name
├── slug (unique)
├── plan (free/starter/professional/enterprise)
├── status (active/suspended/cancelled)
└── settings (JSONB)
```

### 2. User Profiles
```
user_profiles
├── id (PK, FK → auth.users)
├── organization_id (FK → organizations)
├── email
├── full_name
├── role (super_admin/admin/partner/user/api_user)
└── status (active/inactive/suspended)
```

### 3. Partners
```
partners
├── id (PK)
├── organization_id (FK → organizations)
├── name
├── email
├── company_name
├── status (active/paused/archived)
└── metadata (JSONB)
```

### 4. Deals
```
deals
├── id (PK)
├── partner_id (FK → partners)
├── organization_id (FK → organizations)
├── name
├── commission_type (percentage/fixed)
├── commission_value
├── payout_trigger (lead/sale/subscription)
└── status (active/paused/archived)
```

### 5. Leads
```
leads
├── id (PK)
├── partner_id (FK → partners)
├── deal_id (FK → deals)
├── organization_id (FK → organizations)
├── email
├── company
├── status (new/contacted/qualified/converted/lost)
├── source (audit/manual/referral/campaign)
├── priority (hot/warm/cold)
├── estimated_value
└── actual_value
```

### 6. Reports
```
reports
├── id (PK)
├── organization_id (FK → organizations)
├── lead_id (FK → leads)
├── business_name
├── type (snapshot/blueprint)
├── status (draft/generated/delivered)
├── ai_confidence_score
├── revenue_model (JSONB)
├── bottlenecks (JSONB)
├── benchmarks (JSONB)
├── recommendations (JSONB)
└── pdf_url
```

## Payment Tables

### 7. Payment Sessions
```
payment_sessions
├── id (PK)
├── organization_id (FK → organizations)
├── lead_id (FK → leads)
├── report_id (FK → reports)
├── amount
├── currency (USD/EUR/GBP/CAD/AUD)
├── ref_id (unique)
├── paxos_payment_id
├── payment_url
└── status (pending/processing/completed/failed/cancelled/expired)
```

### 8. Payment Transactions
```
payment_transactions
├── id (PK)
├── payment_session_id (FK → payment_sessions)
├── paxos_transaction_id (unique)
├── amount
├── currency
├── payment_method
└── paxos_response (JSONB)
```

### 9. Webhook Events
```
webhook_events
├── id (PK)
├── event_type
├── payment_session_id (FK → payment_sessions)
├── payload (JSONB)
├── processed (boolean)
└── error_message
```

## Settings Tables (All FK → organizations)

```
platform_settings          - Platform configuration
ai_templates              - AI prompt templates
report_configurations     - Report generation settings
industry_settings         - Industry-specific configs
payment_settings          - Payment gateway settings
discount_codes            - Promotional codes
integration_settings      - Third-party integrations
automation_rules          - Workflow automation
funnel_templates          - Reusable funnel templates
system_settings           - System preferences
```

## Subscription Tables

```
subscriptions
├── id (PK)
├── organization_id (FK → organizations)
├── stripe_customer_id
├── stripe_subscription_id
├── plan
└── status

invoices
├── id (PK)
├── organization_id (FK → organizations)
├── stripe_invoice_id
├── amount
└── status
```

## System Tables

```
api_keys                  - API key management
webhooks                  - Webhook configurations
audit_logs                - Audit trail
analytics_events          - Analytics tracking
```

## Key Relationships

1. **Organizations → Everything**: All tables are scoped to an organization (multi-tenancy)
2. **Partners → Deals → Leads**: Referral tracking flow
3. **Leads → Reports → Payments**: Customer journey
4. **Deals → Funnels**: Marketing funnel association
5. **Payment Sessions → Transactions**: Payment processing flow

## Indexes

All tables have indexes on:
- Primary keys (automatic)
- Foreign keys (organization_id, partner_id, etc.)
- Status fields (for filtering)
- Created_at timestamps (for sorting)
- Email fields (for lookups)

## Row Level Security (RLS)

All tables have RLS enabled with policies:
- Users can only access data from their organization
- Admins have additional permissions
- Service role bypasses RLS (for backend operations)

## Views (Analytics)

Pre-built views for common queries:
- `partner_performance` - Partner metrics and conversion rates
- `monthly_revenue` - Revenue trends over time
- `lead_funnel_metrics` - Lead conversion funnel
- `report_metrics` - Report generation statistics
- `payment_metrics` - Payment processing metrics

## Triggers

All tables with `updated_at` have automatic triggers to update the timestamp on every UPDATE operation.

---

For the complete SQL schema, see `supabase-complete-schema.sql`

