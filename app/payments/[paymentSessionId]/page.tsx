"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"

interface PaymentStatus {
  paymentSessionId: string
  status: "pending" | "processing" | "completed" | "failed" | "cancelled" | "expired"
  amount: number
  currency: string
  description: string
  createdAt: string
  completedAt?: string
  errorMessage?: string
}

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const paymentSessionId = params.paymentSessionId as string

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Poll for payment status
  useEffect(() => {
    if (!paymentSessionId) return

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/paxum/payment-status?refId=${paymentSessionId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch payment status")
        }

        const data: PaymentStatus = await response.json()
        setPaymentStatus(data)
        setLoading(false)

        // Stop polling if payment is in a final state
        if (["completed", "failed", "cancelled", "expired"].includes(data.status)) {
          return true // Stop polling
        }

        return false // Continue polling
      } catch (err) {
        console.error("Error checking payment status:", err)
        setError("Failed to check payment status")
        setLoading(false)
        return true // Stop polling on error
      }
    }

    // Initial check
    checkPaymentStatus()

    // Poll every 3 seconds for status updates
    const interval = setInterval(async () => {
      const shouldStop = await checkPaymentStatus()
      if (shouldStop) {
        clearInterval(interval)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [paymentSessionId])

  // Render status icon
  const renderStatusIcon = () => {
    if (loading) return <Loader2 className="h-12 w-12 animate-spin text-purple-600" />

    switch (paymentStatus?.status) {
      case "completed":
        return <CheckCircle2 className="h-12 w-12 text-green-600" />
      case "failed":
      case "cancelled":
      case "expired":
        return <XCircle className="h-12 w-12 text-red-600" />
      case "processing":
        return <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      case "pending":
        return <Clock className="h-12 w-12 text-yellow-600" />
      default:
        return <AlertCircle className="h-12 w-12 text-gray-600" />
    }
  }

  // Render status badge
  const renderStatusBadge = () => {
    if (!paymentStatus) return null

    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const },
      processing: { label: "Processing", variant: "default" as const },
      completed: { label: "Completed", variant: "default" as const },
      failed: { label: "Failed", variant: "destructive" as const },
      cancelled: { label: "Cancelled", variant: "destructive" as const },
      expired: { label: "Expired", variant: "destructive" as const },
    }

    const config = statusConfig[paymentStatus.status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  // Render status message
  const renderStatusMessage = () => {
    if (loading) return "Checking payment status..."

    switch (paymentStatus?.status) {
      case "completed":
        return "Your payment has been successfully processed!"
      case "processing":
        return "Your payment is being processed. Please wait..."
      case "pending":
        return "Awaiting payment confirmation..."
      case "failed":
        return paymentStatus.errorMessage || "Payment failed. Please try again."
      case "cancelled":
        return "Payment was cancelled."
      case "expired":
        return "Payment session has expired. Please create a new payment."
      default:
        return "Unknown payment status"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{renderStatusIcon()}</div>
          <CardTitle className="text-2xl">Payment Status</CardTitle>
          <CardDescription>{renderStatusMessage()}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {paymentStatus && (
            <>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  {renderStatusBadge()}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="font-semibold">
                    {paymentStatus.currency} ${paymentStatus.amount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Description</span>
                  <span className="text-sm">{paymentStatus.description}</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                {paymentStatus.status === "completed" && (
                  <Button className="w-full" onClick={() => router.push("/admin/reports")}>
                    View Your Report
                  </Button>
                )}

                {["failed", "cancelled", "expired"].includes(paymentStatus.status) && (
                  <Button className="w-full" onClick={() => router.push("/wizard")}>
                    Try Again
                  </Button>
                )}

                <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
                  Return to Dashboard
                </Button>
              </div>
            </>
          )}

          {error && (
            <div className="text-center text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

