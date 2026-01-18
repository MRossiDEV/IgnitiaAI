import { getPaxumToken } from "./token"
import {
  PaxosPaymentRequest,
  PaxosPaymentResponse,
  PaxosPaymentListResponse,
} from "../models/payment"

// ============================================================================
// PAXOS API CLIENT
// Handles all communication with Paxos/Paxum API
// ============================================================================

const getApiBaseUrl = (): string => {
  return process.env.PAXUM_API_BASE_URL || "https://api.sandbox.paxos.com/v2"
}

// ============================================================================
// CREATE PAYMENT
// ============================================================================

export async function createPaxosPayment(
  request: PaxosPaymentRequest
): Promise<PaxosPaymentResponse> {
  const token = await getPaxumToken()
  const baseUrl = getApiBaseUrl()

  try {
    const response = await fetch(`${baseUrl}/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to create Paxos payment: ${response.status} ${errorText}`)
    }

    const data: PaxosPaymentResponse = await response.json()
    return data
  } catch (error) {
    console.error("Error creating Paxos payment:", error)
    throw error
  }
}

// ============================================================================
// GET PAYMENT BY REF_ID
// ============================================================================

export async function getPaxosPaymentByRefId(
  refId: string
): Promise<PaxosPaymentResponse | null> {
  const token = await getPaxumToken()
  const baseUrl = getApiBaseUrl()

  try {
    const response = await fetch(
      `${baseUrl}/statements/payments?ref_ids[]=${encodeURIComponent(refId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to get Paxos payment: ${response.status} ${errorText}`)
    }

    const data: PaxosPaymentListResponse = await response.json()

    if (data.payments && data.payments.length > 0) {
      const payment = data.payments[0]
      return {
        id: payment.id,
        ref_id: payment.ref_id,
        amount: payment.payment_amount,
        currency: "USD", // Default, adjust based on your needs
        status: payment.payment_status,
        created_at: payment.created_at,
      }
    }

    return null
  } catch (error) {
    console.error("Error getting Paxos payment:", error)
    throw error
  }
}

// ============================================================================
// LIST PAYMENTS
// ============================================================================

export async function listPaxosPayments(
  refIds: string[]
): Promise<PaxosPaymentListResponse> {
  const token = await getPaxumToken()
  const baseUrl = getApiBaseUrl()

  try {
    const queryParams = refIds.map((id) => `ref_ids[]=${encodeURIComponent(id)}`).join("&")
    const response = await fetch(`${baseUrl}/statements/payments?${queryParams}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to list Paxos payments: ${response.status} ${errorText}`)
    }

    const data: PaxosPaymentListResponse = await response.json()
    return data
  } catch (error) {
    console.error("Error listing Paxos payments:", error)
    throw error
  }
}

// ============================================================================
// MAP PAXOS STATUS TO INTERNAL STATUS
// ============================================================================

export function mapPaxosStatus(paxosStatus: string): string {
  const statusMap: Record<string, string> = {
    PAYMENT_STATUS_PENDING: "pending",
    PAYMENT_STATUS_PROCESSING: "processing",
    PAYMENT_STATUS_COMPLETED: "completed",
    PAYMENT_STATUS_FAILED: "failed",
    PAYMENT_STATUS_CANCELLED: "cancelled",
  }

  return statusMap[paxosStatus] || "pending"
}

