"use client"

import Link from "next/link"
import { useState } from "react"
import { partners } from "@/lib/mock/partners"
import { deals } from "@/lib/mock/deals"

export default function PartnersPage() {
  const [partnerList] = useState(partners)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Partners</h1>
        <Link
          href="/admin/partners/new"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Partner
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Industry</th>
              <th className="text-left p-4">City</th>
              <th className="text-left p-4">Deals</th>
            </tr>
          </thead>
          <tbody>
            {partnerList.map(p => {
              const dealCount = deals.filter(d => d.partnerId === p.id).length
              return (
                <tr key={p.id} className="border-t hover:bg-purple-50 cursor-pointer">
                  <td className="p-4">
                    <Link href={`/admin/partners/${p.id}`} className="font-medium">
                      {p.name}
                    </Link>
                  </td>
                  <td className="p-4">{p.industry}</td>
                  <td className="p-4">{p.city}</td>
                  <td className="p-4">{dealCount}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
