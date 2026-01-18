"use client"

import Link from "next/link"
import { funnels as mockFunnels } from "@/lib/mock/funnels"
import { deals as mockDeals } from "@/lib/mock/deals"

export default function FunnelsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Funnels</h1>
        <Link
          href="/admin/funnels/new"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          + Create Funnel
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Funnel Name</th>
              <th className="text-left p-4">Deal</th>
              <th className="text-left p-4">Steps</th>
              <th className="text-left p-4">Created At</th>
            </tr>
          </thead>
          <tbody>
            {mockFunnels.map(f => {
              const deal = mockDeals.find(d => d.id === f.dealId)
              return (
                <tr key={f.id} className="border-t hover:bg-purple-50 cursor-pointer">
                  <td className="p-4 font-medium">
                    <Link href={`/admin/funnels/${f.id}`}>{f.name}</Link>
                  </td>
                  <td className="p-4">{deal?.name || "Unknown Deal"}</td>
                  <td className="p-4">{f.steps.length}</td>
                  <td className="p-4">{f.createdAt}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
