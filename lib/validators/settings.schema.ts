// Settings Validation Schemas using Zod

import { z } from "zod"

// ============================================================================
// PLATFORM SETTINGS
// ============================================================================

export const platformSettingsSchema = z.object({
  platformName: z.string().min(1, "Platform name is required").max(100),
  defaultCurrency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD"]),
  timezone: z.string().min(1, "Timezone is required"),
  businessVerticals: z.array(z.string()).min(1, "At least one business vertical is required"),
  logoUrl: z.string().url().optional().or(z.literal("")),
  emailSender: z.string().email("Invalid email address"),
  reportFooterText: z.string().max(500, "Footer text too long"),
})

export type PlatformSettingsFormData = z.infer<typeof platformSettingsSchema>

// ============================================================================
// AI TEMPLATES
// ============================================================================

export const customSectionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Section name is required"),
  description: z.string().optional(),
  promptAddition: z.string().optional(),
  order: z.number().int().min(0),
})

export const aiTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required").max(100),
  templateType: z.enum(["free_report", "paid_report", "email", "custom"]),
  industry: z.string().optional(),
  promptTemplate: z.string().min(10, "Prompt template must be at least 10 characters"),
  systemPrompt: z.string().optional(),
  model: z.string().min(1, "Model is required"),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().int().min(100).max(32000),
  outputFormat: z.enum(["markdown", "html", "json"]),
  placeholders: z.array(z.string()),
  customSections: z.array(customSectionSchema),
  isActive: z.boolean(),
})

export type AITemplateFormData = z.infer<typeof aiTemplateSchema>

// ============================================================================
// REPORT CONFIGURATIONS
// ============================================================================

const reportSectionEnum = z.enum([
  "revenue_snapshot",
  "quick_wins",
  "basic_analysis",
  "deep_analysis",
  "competitor_analysis",
  "growth_roadmap",
  "implementation_plan",
  "revenue_leakage",
  "conversion_optimization",
  "seo_analysis",
])

export const reportConfigurationSchema = z.object({
  freeReportSections: z.array(reportSectionEnum).min(1, "At least one free section required"),
  paidReportSections: z.array(reportSectionEnum).min(1, "At least one paid section required"),
  enableRedemptionTracking: z.boolean(),
  pdfFontFamily: z.string().min(1, "Font family is required"),
  pdfPrimaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  pdfSecondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  pdfHeaderTemplate: z.string().optional(),
  pdfFooterTemplate: z.string().optional(),
  enableUpsell: z.boolean(),
  upsellMessage: z.string().max(500, "Upsell message too long"),
  upsellPrice: z.number().min(0, "Price must be positive"),
})

export type ReportConfigurationFormData = z.infer<typeof reportConfigurationSchema>

// ============================================================================
// INDUSTRY SETTINGS
// ============================================================================

export const customMetricSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Metric name is required"),
  description: z.string().optional(),
  unit: z.string().optional(),
  benchmarkValue: z.number().optional(),
})

export const industrySettingsSchema = z.object({
  industryName: z.string().min(1, "Industry name is required").max(100),
  displayName: z.string().min(1, "Display name is required").max(100),
  description: z.string().max(500).optional(),
  reportSections: z.array(reportSectionEnum).min(1, "At least one section required"),
  customMetrics: z.array(customMetricSchema),
  aiPromptOverrides: z.string().optional(),
  benchmarkData: z.record(z.any()),
  isActive: z.boolean(),
})

export type IndustrySettingsFormData = z.infer<typeof industrySettingsSchema>

// ============================================================================
// PAYMENT SETTINGS
// ============================================================================

export const paymentSettingsSchema = z.object({
  stripeApiKey: z.string().optional(),
  stripeWebhookSecret: z.string().optional(),
  paxumApiKey: z.string().optional(),
  paxumEmail: z.string().email().optional().or(z.literal("")),
  defaultReportPrice: z.number().min(0, "Price must be positive"),
  defaultCommissionType: z.enum(["percentage", "fixed"]),
  defaultCommissionValue: z.number().min(0, "Commission must be positive"),
  taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100"),
  vatRate: z.number().min(0).max(100, "VAT rate must be between 0 and 100"),
  enableDiscounts: z.boolean(),
})

export type PaymentSettingsFormData = z.infer<typeof paymentSettingsSchema>

export const discountCodeSchema = z.object({
  code: z.string().min(1, "Code is required").max(50).toUpperCase(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().min(0, "Discount must be positive"),
  maxUses: z.number().int().min(1).optional(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime().optional(),
  isActive: z.boolean(),
})

export type DiscountCodeFormData = z.infer<typeof discountCodeSchema>

// ============================================================================
// INTEGRATION SETTINGS
// ============================================================================

export const integrationSettingsSchema = z.object({
  emailService: z.enum(["sendgrid", "mailgun", "resend", "ses"]).optional(),
  emailApiKey: z.string().optional(),
  analyticsService: z.enum(["google_analytics", "plausible", "matomo"]).optional(),
  analyticsTrackingId: z.string().optional(),
  crmService: z.enum(["hubspot", "salesforce", "pipedrive"]).optional(),
  crmApiKey: z.string().optional(),
  crmExportEnabled: z.boolean(),
  osintApiKeys: z.record(z.string()),
  webhookUrls: z.array(z.string().url()),
})

export type IntegrationSettingsFormData = z.infer<typeof integrationSettingsSchema>

// ============================================================================
// AUTOMATION RULES
// ============================================================================

export const automationActionSchema = z.object({
  type: z.string().min(1, "Action type is required"),
  config: z.record(z.any()),
})

export const automationRuleSchema = z.object({
  ruleName: z.string().min(1, "Rule name is required").max(100),
  ruleType: z.enum(["lead_creation", "lead_assignment", "report_generation", "notification", "status_change"]),
  triggerEvent: z.string().min(1, "Trigger event is required"),
  conditions: z.record(z.any()),
  actions: z.array(automationActionSchema).min(1, "At least one action required"),
  isActive: z.boolean(),
  priority: z.number().int().min(0).max(100),
})

export type AutomationRuleFormData = z.infer<typeof automationRuleSchema>

