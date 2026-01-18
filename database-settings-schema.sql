-- Settings Page Database Schema
-- Add to existing database-schema.sql or run separately

-- ============================================================================
-- PLATFORM SETTINGS
-- ============================================================================

CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform_name TEXT DEFAULT 'Ignitia AI',
  default_currency TEXT DEFAULT 'USD' CHECK (default_currency IN ('USD', 'EUR', 'GBP', 'CAD', 'AUD')),
  timezone TEXT DEFAULT 'UTC',
  business_verticals TEXT[] DEFAULT ARRAY['Hospitality', 'Tourism', 'Services'],
  logo_url TEXT,
  email_sender TEXT DEFAULT 'no-reply@ignitia.ai',
  report_footer_text TEXT DEFAULT 'Powered by Ignitia AI',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id)
);

-- ============================================================================
-- AI TEMPLATES
-- ============================================================================

CREATE TABLE ai_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('free_report', 'paid_report', 'email', 'custom')),
  industry TEXT,
  prompt_template TEXT NOT NULL,
  system_prompt TEXT,
  model TEXT DEFAULT 'gpt-4',
  temperature DECIMAL(2,1) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 2000,
  output_format TEXT DEFAULT 'markdown' CHECK (output_format IN ('markdown', 'html', 'json')),
  placeholders JSONB DEFAULT '[]',
  custom_sections JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- REPORT CONFIGURATIONS
-- ============================================================================

CREATE TABLE report_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  free_report_sections TEXT[] DEFAULT ARRAY['revenue_snapshot', 'quick_wins', 'basic_analysis'],
  paid_report_sections TEXT[] DEFAULT ARRAY['revenue_snapshot', 'quick_wins', 'deep_analysis', 'competitor_analysis', 'growth_roadmap', 'implementation_plan'],
  enable_redemption_tracking BOOLEAN DEFAULT true,
  pdf_font_family TEXT DEFAULT 'Inter',
  pdf_primary_color TEXT DEFAULT '#7C3AED',
  pdf_secondary_color TEXT DEFAULT '#1F2937',
  pdf_header_template TEXT,
  pdf_footer_template TEXT,
  enable_upsell BOOLEAN DEFAULT true,
  upsell_message TEXT DEFAULT 'Unlock your complete Growth Blueprint for $500',
  upsell_price DECIMAL(10,2) DEFAULT 500.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id)
);

-- ============================================================================
-- INDUSTRY SETTINGS
-- ============================================================================

CREATE TABLE industry_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  industry_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  report_sections TEXT[] DEFAULT ARRAY['revenue_analysis', 'market_analysis', 'growth_opportunities'],
  custom_metrics JSONB DEFAULT '[]',
  ai_prompt_overrides TEXT,
  benchmark_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, industry_name)
);

-- ============================================================================
-- PAYMENT SETTINGS
-- ============================================================================

CREATE TABLE payment_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  stripe_api_key_encrypted TEXT,
  stripe_webhook_secret_encrypted TEXT,
  paxum_api_key_encrypted TEXT,
  paxum_email TEXT,
  default_report_price DECIMAL(10,2) DEFAULT 500.00,
  default_commission_type TEXT DEFAULT 'percentage' CHECK (default_commission_type IN ('percentage', 'fixed')),
  default_commission_value DECIMAL(10,2) DEFAULT 20.00,
  tax_rate DECIMAL(5,2) DEFAULT 0.00,
  vat_rate DECIMAL(5,2) DEFAULT 0.00,
  enable_discounts BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id)
);

CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, code)
);

-- ============================================================================
-- INTEGRATION SETTINGS
-- ============================================================================

CREATE TABLE integration_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email_service TEXT CHECK (email_service IN ('sendgrid', 'mailgun', 'resend', 'ses')),
  email_api_key_encrypted TEXT,
  analytics_service TEXT CHECK (analytics_service IN ('google_analytics', 'plausible', 'matomo')),
  analytics_tracking_id TEXT,
  crm_service TEXT CHECK (crm_service IN ('hubspot', 'salesforce', 'pipedrive')),
  crm_api_key_encrypted TEXT,
  crm_export_enabled BOOLEAN DEFAULT false,
  osint_api_keys JSONB DEFAULT '{}',
  webhook_urls JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id)
);

-- ============================================================================
-- AUTOMATION RULES
-- ============================================================================

CREATE TABLE automation_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('lead_creation', 'lead_assignment', 'report_generation', 'notification', 'status_change')),
  trigger_event TEXT NOT NULL,
  conditions JSONB DEFAULT '{}',
  actions JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- FUNNEL TEMPLATES
-- ============================================================================

CREATE TABLE funnel_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SYSTEM SETTINGS
-- ============================================================================

CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  enable_logging BOOLEAN DEFAULT true,
  enable_audit BOOLEAN DEFAULT true,
  data_retention_days INTEGER DEFAULT 365,
  system_alerts TEXT[] DEFAULT ARRAY['errors', 'api_failures', 'payment_failures'],
  backup_frequency TEXT DEFAULT 'daily' CHECK (backup_frequency IN ('hourly', 'daily', 'weekly')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_ai_templates_organization_id ON ai_templates(organization_id);
CREATE INDEX idx_ai_templates_type ON ai_templates(template_type);
CREATE INDEX idx_ai_templates_industry ON ai_templates(industry);
CREATE INDEX idx_ai_templates_active ON ai_templates(is_active);

CREATE INDEX idx_industry_settings_organization_id ON industry_settings(organization_id);
CREATE INDEX idx_industry_settings_active ON industry_settings(is_active);

CREATE INDEX idx_discount_codes_organization_id ON discount_codes(organization_id);
CREATE INDEX idx_discount_codes_code ON discount_codes(code);
CREATE INDEX idx_discount_codes_active ON discount_codes(is_active);

CREATE INDEX idx_automation_rules_organization_id ON automation_rules(organization_id);
CREATE INDEX idx_automation_rules_type ON automation_rules(rule_type);
CREATE INDEX idx_automation_rules_active ON automation_rules(is_active);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

