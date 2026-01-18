# Settings Page Implementation Tasks

Based on PRD: Ignitia AI Platform – Settings Page v1.0

---

## Phase 1: Planning & Database Schema ⏳

### Task 1.1: Review PRD & Plan Architecture
- [x] Review complete PRD requirements
- [x] Identify all settings categories
- [x] Plan component structure
- [x] Define data models

### Task 1.2: Database Schema Design
- [ ] Create `platform_settings` table
- [ ] Create `ai_templates` table
- [ ] Create `report_configurations` table
- [ ] Create `industry_settings` table
- [ ] Create `payment_settings` table
- [ ] Create `integration_settings` table
- [ ] Create `funnel_templates` table
- [ ] Create `automation_rules` table
- [ ] Add indexes and constraints

### Task 1.3: TypeScript Type Definitions
- [ ] Define `PlatformSettings` interface
- [ ] Define `AITemplate` interface
- [ ] Define `ReportConfiguration` interface
- [ ] Define `IndustrySettings` interface
- [ ] Define `PaymentSettings` interface
- [ ] Define `IntegrationSettings` interface
- [ ] Define `AutomationRule` interface

---

## Phase 2: API Layer Development ⏳

### Task 2.1: General Settings API
- [ ] `GET /api/settings/general` - Fetch general settings
- [ ] `PUT /api/settings/general` - Update general settings
- [ ] `POST /api/settings/general/logo` - Upload logo

### Task 2.2: AI Templates API
- [ ] `GET /api/settings/ai-templates` - List all templates
- [ ] `POST /api/settings/ai-templates` - Create template
- [ ] `PUT /api/settings/ai-templates/:id` - Update template
- [ ] `DELETE /api/settings/ai-templates/:id` - Delete template
- [ ] `POST /api/settings/ai-templates/:id/preview` - Preview AI output

### Task 2.3: Report Settings API
- [ ] `GET /api/settings/reports` - Fetch report configuration
- [ ] `PUT /api/settings/reports` - Update report settings
- [ ] `POST /api/settings/reports/preview` - Preview report styling

### Task 2.4: Industry Settings API
- [ ] `GET /api/settings/industries` - List industries
- [ ] `POST /api/settings/industries` - Create industry
- [ ] `PUT /api/settings/industries/:id` - Update industry
- [ ] `DELETE /api/settings/industries/:id` - Delete industry

### Task 2.5: Payment Settings API
- [ ] `GET /api/settings/payments` - Fetch payment settings
- [ ] `PUT /api/settings/payments` - Update payment settings
- [ ] `POST /api/settings/payments/test-stripe` - Test Stripe connection

### Task 2.6: Integration Settings API
- [ ] `GET /api/settings/integrations` - Fetch integrations
- [ ] `PUT /api/settings/integrations` - Update integrations
- [ ] `POST /api/settings/integrations/test` - Test integration

### Task 2.7: Automation Rules API
- [ ] `GET /api/settings/automation` - Fetch automation rules
- [ ] `PUT /api/settings/automation` - Update automation rules

---

## Phase 3: UI Components & Tabs ⏳

### Task 3.1: Settings Page Layout
- [ ] Create `app/admin/settings/page.tsx`
- [ ] Build sidebar navigation component
- [ ] Implement tab routing
- [ ] Add breadcrumb navigation
- [ ] Create settings header with save/cancel actions

### Task 3.2: General Platform Settings Tab
- [ ] Platform name input
- [ ] Currency dropdown
- [ ] Timezone selector
- [ ] Business vertical multi-select
- [ ] Logo upload component
- [ ] Email sender input
- [ ] Report footer textarea
- [ ] Form validation

### Task 3.3: AI Configuration & Templates Tab
- [ ] Free report prompt editor
- [ ] Paid report prompt editor
- [ ] Placeholder helper (show available placeholders)
- [ ] Custom sections manager
- [ ] Industry-specific template selector
- [ ] AI model dropdown
- [ ] Output style selector
- [ ] Preview button & modal

### Task 3.4: Report Settings Tab
- [ ] Free report sections multi-select
- [ ] Paid report sections multi-select
- [ ] Redemption tracking toggle
- [ ] PDF styling editor (fonts, colors, headers)
- [ ] Upsell offer toggle & text editor
- [ ] Report preview component

### Task 3.5: Funnel & Landing Page Settings Tab
- [ ] Funnel template selector
- [ ] Funnel steps manager (add/edit/delete/reorder)
- [ ] Funnel analytics toggle
- [ ] Link to funnel builder
- [ ] Default funnel configuration

### Task 3.6: Leads & Deals Automation Tab
- [ ] Auto-create lead toggle
- [ ] Lead assignment rule builder
- [ ] AI insights toggle
- [ ] Status workflow editor (multi-row)
- [ ] Notification settings (email/SMS)
- [ ] Automation preview

### Task 3.7: Payment & Pricing Settings Tab
- [ ] Stripe API key input (masked)
- [ ] Paxum integration fields
- [ ] Report price input
- [ ] Default commission input
- [ ] Tax/VAT percentage
- [ ] Discount codes manager
- [ ] Test payment button

### Task 3.8: Industry Settings Tab
- [ ] Industry list view
- [ ] Add industry modal
- [ ] Edit industry form
- [ ] Custom metrics manager
- [ ] Report sections selector
- [ ] AI prompt override editor
- [ ] Delete industry confirmation

### Task 3.9: Integration Settings Tab
- [ ] Email service selector & API key
- [ ] Analytics integration (GA, Plausible)
- [ ] CRM export toggle & configuration
- [ ] OSINT data API keys
- [ ] Test integration buttons
- [ ] Integration status indicators

### Task 3.10: Miscellaneous Settings Tab
- [ ] Logging & audit toggle
- [ ] Data retention input
- [ ] System alerts multi-select
- [ ] Backup/export button
- [ ] System health dashboard
- [ ] Activity log viewer

---

## Phase 4: Advanced Features ⏳

### Task 4.1: Template Editor Component
- [ ] Rich text editor for AI prompts
- [ ] Syntax highlighting for placeholders
- [ ] Placeholder autocomplete
- [ ] Template versioning
- [ ] Template import/export

### Task 4.2: Preview Functionality
- [ ] AI prompt preview with sample data
- [ ] Report PDF preview
- [ ] Email template preview
- [ ] Funnel preview

### Task 4.3: Validation & Error Handling
- [ ] Form validation for all inputs
- [ ] API error handling
- [ ] Inline error messages
- [ ] Success notifications
- [ ] Unsaved changes warning

### Task 4.4: Help & Documentation
- [ ] Inline tooltips for all settings
- [ ] Help sidebar with examples
- [ ] Video tutorials (links)
- [ ] Settings documentation

---

## Phase 5: Testing & Quality Assurance ⏳

### Task 5.1: Unit Tests
- [ ] Test settings API endpoints
- [ ] Test validation logic
- [ ] Test data transformations

### Task 5.2: Integration Tests
- [ ] Test settings save/load flow
- [ ] Test AI template preview
- [ ] Test payment integration
- [ ] Test automation rules

### Task 5.3: E2E Tests
- [ ] Test complete settings workflow
- [ ] Test all tabs navigation
- [ ] Test form submissions
- [ ] Test error scenarios

---

## Implementation Priority

**Week 1: Foundation**
- Database schema
- Type definitions
- Basic API routes
- Settings page layout

**Week 2: Core Tabs**
- General settings
- AI templates
- Report settings

**Week 3: Advanced Tabs**
- Payment settings
- Industry settings
- Integration settings

**Week 4: Polish & Testing**
- Preview functionality
- Validation
- Testing
- Documentation

---

**Total Estimated Time:** 4 weeks (1 developer)  
**Priority:** HIGH  
**Dependencies:** Database setup, Authentication, File upload service
