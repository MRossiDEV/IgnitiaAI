-- ============================================================================
-- PAYMENT TRANSACTIONS SCHEMA
-- For Paxum/Paxos Payment Gateway Integration
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PAYMENT SESSIONS TABLE
-- Tracks payment session creation and lifecycle
-- ============================================================================

CREATE TABLE payment_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  
  -- Payment details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'GBP', 'CAD', 'AUD')),
  description TEXT NOT NULL,
  
  -- Paxos/Paxum specific fields
  ref_id TEXT UNIQUE NOT NULL, -- Format: {leadId}-{reportId}-{timestamp}
  paxos_payment_id TEXT UNIQUE, -- ID returned from Paxos API
  payment_url TEXT, -- URL to redirect user for payment
  
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',      -- Payment session created, awaiting user action
    'processing',   -- Payment is being processed
    'completed',    -- Payment successfully completed
    'failed',       -- Payment failed
    'cancelled',    -- Payment cancelled by user
    'expired'       -- Payment session expired
  )),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  
  -- Indexes
  CONSTRAINT valid_amount CHECK (amount > 0)
);

-- ============================================================================
-- PAYMENT TRANSACTIONS TABLE
-- Detailed transaction records from Paxos
-- ============================================================================

CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_session_id UUID REFERENCES payment_sessions(id) ON DELETE CASCADE,
  
  -- Paxos transaction details
  paxos_transaction_id TEXT UNIQUE NOT NULL,
  paxos_payment_id TEXT NOT NULL,
  
  -- Transaction details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  payment_method TEXT, -- e.g., 'card', 'bank_transfer', 'crypto'
  
  -- Status
  transaction_status TEXT NOT NULL,
  
  -- Additional data from Paxos
  paxos_response JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- WEBHOOK EVENTS TABLE
-- Log all webhook events from Paxos for debugging and reconciliation
-- ============================================================================

CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Event details
  event_type TEXT NOT NULL, -- e.g., 'payment.completed', 'payment.failed'
  event_id TEXT UNIQUE, -- Paxos event ID if provided
  
  -- Related payment
  payment_session_id UUID REFERENCES payment_sessions(id) ON DELETE SET NULL,
  ref_id TEXT,
  
  -- Payload
  payload JSONB NOT NULL,
  
  -- Processing status
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  
  -- Timestamps
  received_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_payment_sessions_lead_id ON payment_sessions(lead_id);
CREATE INDEX idx_payment_sessions_report_id ON payment_sessions(report_id);
CREATE INDEX idx_payment_sessions_ref_id ON payment_sessions(ref_id);
CREATE INDEX idx_payment_sessions_status ON payment_sessions(status);
CREATE INDEX idx_payment_sessions_created_at ON payment_sessions(created_at);

CREATE INDEX idx_payment_transactions_session_id ON payment_transactions(payment_session_id);
CREATE INDEX idx_payment_transactions_paxos_id ON payment_transactions(paxos_transaction_id);

CREATE INDEX idx_webhook_events_ref_id ON webhook_events(ref_id);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_events_received_at ON webhook_events(received_at);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payment_sessions_updated_at BEFORE UPDATE ON payment_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

