"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface BuyReportButtonProps {
  leadId: string
  reportId: string
  amount?: number
  currency?: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export function BuyReportButton({
  leadId,
  reportId,
  amount = 500.0,
  currency = "USD",
  description = "Ignitia AI Growth Blueprint",
  className,
  children = "Buy Full Blueprint - $500",
}: BuyReportButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePurchase = async () => {
    setLoading(true)
    setError(null)

    try {
      // Create payment session
      const response = await fetch("/api/paxum/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
          reportId,
          leadId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create payment")
      }

      const data = await response.json()

      // Redirect to payment URL
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      } else {
        // Fallback: redirect to payment status page
        router.push(`/payments/${data.paymentSessionId}`)
      }
    } catch (err) {
      console.error("Error creating payment:", err)
      setError(err instanceof Error ? err.message : "Failed to create payment")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handlePurchase}
        disabled={loading}
        className={className}
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating payment...
          </>
        ) : (
          children
        )}
      </Button>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

