"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { deals as mockDeals } from "@/lib/mock/deals"
import { leads as mockLeads } from "@/lib/mock/leads"
import Link from "next/link"

export default function DealDetailPage() {
  const params = useParams()
  const dealId = params.dealId
  const router = useRouter()

  const deal = mockDeals.find(d => d.id === dealId)

  const [formData, setFormData] = useState({
    name: deal?.name || "",
    description: deal?.description || "",
    commissionType: deal?.commissionType || "percentage",
    commissionValue: deal?.commissionValue || 0,
    price: deal?.price || 0,
    payoutTrigger: deal?.payoutTrigger || "lead",
    status: deal?.status || "active",
    startDate: deal?.startDate || "",
    endDate: deal?.endDate || "",
    notes: deal?.notes || "",
  })

  if (!deal) {
    return <div className="p-6 text-red-500">Deal not found</div>
  }

  // Filter redemptions for this deal from leads mock data
  const dealRedemptions = mockLeads.filter(l => l.dealId === deal.id && l.status === "converted")

  // Calculate revenue
  const totalRevenue = dealRedemptions.reduce((acc, r) => {
    if (deal.commissionType === "percentage") {
      return acc + ((deal.price || 0) * (deal.commissionValue / 100))
    } else {
      return acc + (deal.commissionValue || 0)
    }
  }, 0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = () => {
    // For now, just log the formData
    console.log("Saved deal data:", formData)
    alert("Deal saved (mock)")
  }

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{deal.name}</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          ← Back
        </button>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-sm text-gray-500">Total Revenue</h3>
          <p className="mt-2 text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-sm text-gray-500">Total Redemptions</h3>
          <p className="mt-2 text-2xl font-bold">{dealRedemptions.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-sm text-gray-500">Commission</h3>
          <p className="mt-2 text-2xl font-bold">
            {deal.commissionType === "percentage" ? `${deal.commissionValue}%` : `$${deal.commissionValue}`}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-sm text-gray-500">Status</h3>
          <p className="mt-2 text-2xl font-bold capitalize">{deal.status}</p>
        </div>
      </div>

      {/* EDIT FORM */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Edit Deal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium">Deal Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 w-full border-gray-300 rounded-lg shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Partner ID</label>
            <input
              type="text"
              value={deal.partnerId}
              disabled
              className="mt-1 w-full border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Commission Type</label>
            <select
              name="commissionType"
              value={formData.commissionType}
              onChange={handleInputChange}
              className="mt-1 w-full border-gray-300 rounded-lg"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Commission Value</label>
            <input
              type="number"
              name="commissionValue"
              value={formData.commissionValue}
              onChange={handleInputChange}
              className="mt-1 w-full border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="mt-1 w-full border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 w-full border-gray-300 rounded-lg"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 w-full border-gray-300 rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="mt-1 w-full border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg mt-4"
        >
          Save Deal
        </button>
      </div>

      {/* REDEMPTIONS LIST */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Redemptions</h2>
        {dealRedemptions.length === 0 ? (
          <p className="text-gray-500">No redemptions yet for this deal.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Lead Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Value</th>
                <th className="text-left p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {dealRedemptions.map(r => (
                <tr key={r.id} className="border-t hover:bg-purple-50">
                  <td className="p-4">{r.name}</td>
                  <td className="p-4">{r.email}</td>
                  <td className="p-4">
                    {deal.commissionType === "percentage" 
                      ? `$${((deal.price || 0) * (deal.commissionValue / 100)).toFixed(2)}`
                      : `$${deal.commissionValue}`
                    }
                  </td>
                  <td className="p-4">{r.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}
