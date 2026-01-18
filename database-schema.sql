-- Ignitia AI Database Schema
-- PostgreSQL / Supabase
-- Run this in your Supabase SQL Editor or PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ORGANIZATIONS & USERS
-- ============================================================================

-- Organizations table (multi-tenancy support)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'professional', 'enterprise')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
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

-- ============================================================================
-- PARTNERS
-- ============================================================================

CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  industry TEXT,
  country TEXT,
  city TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- DEALS
-- ============================================================================

CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  commission_type TEXT NOT NULL CHECK (commission_type IN ('percentage', 'fixed', 'tiered', 'hybrid')),
  commission_value DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2),
  payout_trigger TEXT NOT NULL CHECK (payout_trigger IN ('sale', 'lead', 'signup', 'trial', 'custom')),
  redemptions INTEGER DEFAULT 0,
  max_redemptions INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired', 'archived')),
  start_date DATE,
  end_date DATE,
  terms TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- LEADS
-- ============================================================================

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  website TEXT,
  industry TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost', 'spam')),
  source TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  estimated_value DECIMAL(10,2),
  actual_value DECIMAL(10,2),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ,
  assigned_to UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- REPORTS
-- ============================================================================

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  report_type TEXT DEFAULT 'growth_audit' CHECK (report_type IN ('growth_audit', 'revenue_analysis', 'competitor_analysis', 'custom')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  ai_insights JSONB,
  recommendations JSONB,
  benchmarks JSONB,
  confidence_score DECIMAL(3,2),
  pdf_url TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- SUBSCRIPTIONS & BILLING
-- ============================================================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'starter', 'professional', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'cancelled', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
  invoice_pdf TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FUNNELS
-- ============================================================================

CREATE TABLE funnels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE funnel_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  conversion_rate DECIMAL(5,2),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(funnel_id, step_order)
);

-- ============================================================================
-- API KEYS & WEBHOOKS
-- ============================================================================

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  permissions JSONB DEFAULT '[]',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'failed')),
  last_triggered_at TIMESTAMPTZ,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AUDIT LOGS
-- ============================================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ANALYTICS & METRICS
-- ============================================================================

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Organizations
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_status ON organizations(status);

-- User Profiles
CREATE INDEX idx_user_profiles_organization_id ON user_profiles(organization_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- Partners
CREATE INDEX idx_partners_organization_id ON partners(organization_id);
CREATE INDEX idx_partners_email ON partners(email);
CREATE INDEX idx_partners_status ON partners(status);
CREATE INDEX idx_partners_created_at ON partners(created_at DESC);

-- Deals
CREATE INDEX idx_deals_partner_id ON deals(partner_id);
CREATE INDEX idx_deals_organization_id ON deals(organization_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_created_at ON deals(created_at DESC);

-- Leads
CREATE INDEX idx_leads_partner_id ON leads(partner_id);
CREATE INDEX idx_leads_deal_id ON leads(deal_id);
CREATE INDEX idx_leads_organization_id ON leads(organization_id);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- Reports
CREATE INDEX idx_reports_organization_id ON reports(organization_id);
CREATE INDEX idx_reports_lead_id ON reports(lead_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- Subscriptions
CREATE INDEX idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Audit Logs
CREATE INDEX idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Analytics Events
CREATE INDEX idx_analytics_events_organization_id ON analytics_events(organization_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can only see their own organization
CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  USING (id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

-- User Profiles: Users can view profiles in their organization
CREATE POLICY "Users can view profiles in their organization"
  ON user_profiles FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

-- Partners: Users can only access their organization's partners
CREATE POLICY "Users can view their organization's partners"
  ON partners FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert partners in their organization"
  ON partners FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their organization's partners"
  ON partners FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can delete partners"
  ON partners FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Similar policies for other tables (deals, leads, reports, etc.)
-- Add more policies as needed based on your access control requirements

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_funnels_updated_at BEFORE UPDATE ON funnels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_funnel_steps_updated_at BEFORE UPDATE ON funnel_steps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA (Optional - for development)
-- ============================================================================

-- Insert a default organization
INSERT INTO organizations (name, slug, plan, status)
VALUES ('Demo Organization', 'demo-org', 'professional', 'active')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VIEWS (Useful for analytics)
-- ============================================================================

-- Partner performance view
CREATE OR REPLACE VIEW partner_performance AS
SELECT
  p.id,
  p.name,
  p.organization_id,
  COUNT(DISTINCT l.id) as total_leads,
  COUNT(DISTINCT CASE WHEN l.status = 'converted' THEN l.id END) as converted_leads,
  COALESCE(SUM(l.actual_value), 0) as total_revenue,
  COUNT(DISTINCT d.id) as active_deals
FROM partners p
LEFT JOIN leads l ON l.partner_id = p.id
LEFT JOIN deals d ON d.partner_id = p.id AND d.status = 'active'
WHERE p.status = 'active'
GROUP BY p.id, p.name, p.organization_id;

-- Monthly revenue view
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT
  organization_id,
  DATE_TRUNC('month', converted_at) as month,
  COUNT(*) as conversions,
  SUM(actual_value) as revenue
FROM leads
WHERE status = 'converted' AND converted_at IS NOT NULL
GROUP BY organization_id, DATE_TRUNC('month', converted_at)
ORDER BY month DESC;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE organizations IS 'Multi-tenant organizations';
COMMENT ON TABLE user_profiles IS 'Extended user profile data';
COMMENT ON TABLE partners IS 'Partner/affiliate accounts';
COMMENT ON TABLE deals IS 'Deals and offers managed by partners';
COMMENT ON TABLE leads IS 'Leads captured through various sources';
COMMENT ON TABLE reports IS 'AI-generated business reports';
COMMENT ON TABLE subscriptions IS 'Stripe subscription data';
COMMENT ON TABLE audit_logs IS 'Audit trail for all important actions';

-- ============================================================================
-- COMPLETE
-- ============================================================================

-- Schema creation complete!
-- Next steps:
-- 1. Review and adjust RLS policies for your specific needs
-- 2. Add additional indexes based on query patterns
-- 3. Set up backup and recovery procedures
-- 4. Configure connection pooling
-- 5. Test all policies and permissions

