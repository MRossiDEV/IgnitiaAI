"use client"

import { useParams, useRouter } from "next/navigation"
import { leads as mockLeads } from "@/lib/mock/leads"

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.leadId

  const lead = mockLeads.find(l => l.id === leadId)

  if (!lead) {
    return (
      <div className="p-6 text-center text-red-500">
        Lead not found
        <button
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          onClick={() => router.push("/admin/leads")}
        >
          Back to Leads
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.push("/admin/leads")}
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 flex items-center gap-2"
      >
        ← Back to Leads
      </button>

      {/* Lead Info Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 border border-gray-100">
        <h1 className="text-2xl font-bold text-purple-700">{lead.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 font-medium">Email</p>
            <p className="text-gray-800">{lead.email}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Phone</p>
            <p className="text-gray-800">{lead.phone}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Source</p>
            <p className="text-gray-800">{lead.source}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Status</p>
            <p
              className={`font-semibold ${
                lead.status === "new"
                  ? "text-blue-600"
                  : lead.status === "contacted"
                  ? "text-green-600"
                  : "text-gray-600"
              }`}
            >
              {lead.status}
            </p>
          </div>
        </div>

        {/* Notes / Additional Info */}
        {lead.notes && (
          <div>
            <p className="text-gray-500 font-medium">Notes</p>
            <p className="text-gray-800">{lead.notes}</p>
          </div>
        )}

        {/* Optional: Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Edit Lead
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete Lead
          </button>
        </div>
      </div>
    </div>
  )
}
