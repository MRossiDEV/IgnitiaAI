"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { funnels as mockFunnels } from "@/lib/mock/funnels"
import { deals as mockDeals } from "@/lib/mock/deals"
import { FunnelStep } from "@/models/funnels"

export default function FunnelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const funnelId = params.funnelId

  const funnel = mockFunnels.find(f => f.id === funnelId)
  const deal = funnel ? mockDeals.find(d => d.id === funnel.dealId) : null

  const [steps, setSteps] = useState<FunnelStep[]>(funnel?.steps || [])

  if (!funnel) return <div className="p-6 text-red-500">Funnel not found</div>

  const handleStepChange = (id: string, content: string) => {
    setSteps(prev => prev.map(s => (s.id === id ? { ...s, content } : s)))
  }

  const handleAddStep = () => {
    const newStep: FunnelStep = {
      id: `step_${Date.now()}`,
      type: "cta",
      content: "New Step",
      order: steps.length + 1,
    }
    setSteps(prev => [...prev, newStep])
  }

  const handleSave = () => {
    console.log("Funnel saved (mock):", { ...funnel, steps })
    alert("Funnel saved (mock)")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{funnel.name}</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Deal: {deal?.name || "Unknown"}</h2>

        <div className="space-y-4">
          {steps.map(step => (
            <div key={step.id} className="border p-4 rounded-lg bg-gray-50">
              <label className="block font-medium mb-1">Step ({step.type})</label>
              <textarea
                value={step.content}
                onChange={e => handleStepChange(step.id, e.target.value)}
                className="w-full border-gray-300 rounded-lg p-2"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleAddStep}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Step
        </button>

        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mt-4"
        >
          Save Funnel
        </button>
      </div>
    </div>
  )
}
