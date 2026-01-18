"use client"

import Link from "next/link"
import { deals as mockDeals } from "@/lib/mock/deals"

// Function to calculate revenue per deal
const calculateDealRevenue = (deal) => {
  if (deal.commissionType === "percentage") {
    return ((deal.price || 0) * (deal.commissionValue / 100)) * (deal.redemptions || 0)
  } else if (deal.commissionType === "fixed") {
    return (deal.commissionValue || 0) * (deal.redemptions || 0)
  }
  return 0
}

export default function DealsPage() {
  // Stats
  const totalRevenue = mockDeals.reduce((acc, deal) => acc + calculateDealRevenue(deal), 0)
  const totalDeals = mockDeals.length
  const activeDeals = mockDeals.filter(d => d.status === "active").length
  const pausedDeals = mockDeals.filter(d => d.status === "paused").length
  const archivedDeals = mockDeals.filter(d => d.status === "archived").length

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Deals Dashboard</h1>
        <Link
          href="/admin/deals/new"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Deal
        </Link>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-sm text-gray-500">Total Revenue</h3>
          <p className="mt-2 text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-sm text-gray-500">Total Deals</h3>
          <p className="mt-2 text-2xl font-bold">{totalDeals}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-sm text-gray-500">Active Deals</h3>
          <p className="mt-2 text-2xl font-bold">{activeDeals}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-sm text-gray-500">Paused Deals</h3>
          <p className="mt-2 text-2xl font-bold">{pausedDeals}</p>
        </div>
      </div>

      {/* DEALS TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Deal Name</th>
              <th className="text-left p-4">Partner</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Commission</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Redemptions</th>
              <th className="text-left p-4">Revenue</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockDeals.map(deal => (
              <tr key={deal.id} className="border-t hover:bg-purple-50">
                <td className="p-4 font-medium">
                  <Link href={`/admin/deals/${deal.id}`}>
                    {deal.name}
                  </Link>
                </td>
                <td className="p-4">{deal.partnerId}</td>
                <td className="p-4">{deal.commissionType}</td>
                <td className="p-4">
                  {deal.commissionType === "percentage" 
                    ? `${deal.commissionValue}%` 
                    : `$${deal.commissionValue}`
                  }
                </td>
                <td className="p-4">${deal.price?.toLocaleString()}</td>
                <td className="p-4">{deal.redemptions || 0}</td>
                <td className="p-4 font-bold">${calculateDealRevenue(deal).toLocaleString()}</td>
                <td className="p-4 capitalize">{deal.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
