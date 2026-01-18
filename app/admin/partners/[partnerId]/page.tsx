"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { partners } from "@/lib/mock/partners"
import { deals as mockDeals } from "@/lib/mock/deals"

export default function PartnerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const partnerId = params?.partnerId!

  const partner = partners.find(p => p.id === partnerId)
  const partnerDeals = mockDeals.filter(d => d.partnerId === partnerId)
  const [deals, setDeals] = useState(partnerDeals)

  if (!partner) return <p>Partner not found</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{partner.name}</h1>
        <p className="text-gray-500">{partner.industry} • {partner.city}</p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Deals</h2>
        <Link
          href={`/admin/partners/${partnerId}/deal/new`}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Deal
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Deal</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Redemptions</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {deals.map(d => (
              <tr key={d.id} className="border-t hover:bg-purple-50">
                <td className="p-4">
                  <Link href={`/admin/partners/${partnerId}/deal/${d.id}`} className="font-medium">
                    {d.title}
                  </Link>
                </td>
                <td className="p-4">{d.commissionType}</td>
                <td className="p-4">{d.redemptions ?? 0}</td>
                <td className="p-4">{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
