"use client"

import Link from "next/link"
import { reports } from "@/lib/mock/reports"

export default function ReportsPage() {
  const totalReports = reports.length
  const sentReports = reports.filter(r => r.status === "sent").length
  const totalImpact = reports.reduce(
    (sum, r) => sum + (r.estimatedImpact || 0),
    0
  )

  return (
    <div className="p-6 space-y-8 w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Link
          href="/admin/reports/new"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          + Create Report
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Reports" value={totalReports} />
        <StatCard title="Reports Sent" value={sentReports} />
        <StatCard title="Estimated Revenue Impact" value={`$${totalImpact}`} />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Score</th>
              <th className="p-4 text-left">Impact</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr
                key={r.id}
                className="border-t hover:bg-purple-50 cursor-pointer"
              >
                <td className="p-4 font-medium">
                  <Link href={`/admin/reports/${r.id}`}>
                    {r.title}
                  </Link>
                </td>
                <td className="p-4 capitalize">{r.type.replace("-", " ")}</td>
                <td className="p-4">{r.score ?? "-"}</td>
                <td className="p-4">${r.estimatedImpact ?? 0}</td>
                <td className="p-4 capitalize">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}

