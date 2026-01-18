import { z } from "zod"

// ============================================================================
// PAYMENT VALIDATION SCHEMAS
// ============================================================================

export const currencyEnum = z.enum(["USD", "EUR", "GBP", "CAD", "AUD"])

export const paymentStatusEnum = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
  "expired",
])

// ============================================================================
// CREATE PAYMENT REQUEST SCHEMA
// ============================================================================

export const createPaymentSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  currency: currencyEnum,
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  reportId: z.string().min(1, "Report ID is required"),
  leadId: z.string().min(1, "Lead ID is required"),
})

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>

// ============================================================================
// WEBHOOK PAYLOAD SCHEMA
// ============================================================================

export const webhookPayloadSchema = z.object({
  event: z.string().min(1, "Event type is required"),
  data: z.object({
    ref_id: z.string().min(1, "Reference ID is required"),
    payment_amount: z.number().positive(),
    status: z.string().min(1),
    payment_id: z.string().optional(),
    transaction_id: z.string().optional(),
    error: z.string().optional(),
  }),
})

export type WebhookPayloadInput = z.infer<typeof webhookPayloadSchema>

// ============================================================================
// PAYMENT SESSION SCHEMA
// ============================================================================

export const paymentSessionSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  leadId: z.string().uuid().optional(),
  reportId: z.string().uuid().optional(),
  amount: z.number().positive(),
  currency: currencyEnum,
  description: z.string(),
  refId: z.string(),
  paxosPaymentId: z.string().optional(),
  paymentUrl: z.string().url().optional(),
  status: paymentStatusEnum,
  metadata: z.record(z.any()).optional(),
  errorMessage: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime(),
})

export type PaymentSessionInput = z.infer<typeof paymentSessionSchema>

