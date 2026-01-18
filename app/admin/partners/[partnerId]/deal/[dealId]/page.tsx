"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { deals as mockDeals } from "@/lib/mock/deals"
import { partners as mockPartners } from "@/lib/mock/partners"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js"
import { Bar, Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

export default function DealDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const { partnerId, dealId } = params

  const deal = mockDeals.find(d => d.id === dealId)
  const partner = mockPartners.find(p => p.id === partnerId)

  if (!deal || !partner) return <p className="p-6 text-red-500">Deal or Partner not found</p>

  // Mock data for charts
  const [dailyRedemptions, setDailyRedemptions] = useState<number[]>([])
  const [weeklyRedemptions, setWeeklyRedemptions] = useState<number[]>([])

  useEffect(() => {
    // Generate random data for demonstration
    setDailyRedemptions(Array.from({ length: 7 }, () => Math.floor(Math.random() * 5)))
    setWeeklyRedemptions(Array.from({ length: 4 }, () => Math.floor(Math.random() * 20)))
  }, [])

  // Bar chart data
  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Redemptions",
        data: dailyRedemptions,
        backgroundColor: "rgba(124, 58, 237, 0.7)",
      },
    ],
  }

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Weekly Redemptions",
        data: weeklyRedemptions,
        borderColor: "rgba(124, 58, 237, 0.8)",
        backgroundColor: "rgba(124, 58, 237, 0.2)",
        tension: 0.4,
      },
    ],
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{deal.title}</h1>
          <p className="text-gray-500">
            Partner: {partner.name} • {partner.industry || "Industry"}
          </p>
        </div>
        <button
          onClick={() => router.push(`/admin/partners/${partner.id}/deal/${deal.id}/edit`)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          Edit Deal
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 font-medium">Total Redemptions</h3>
          <p className="text-2xl font-bold">{deal.redemptions}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 font-medium">Status</h3>
          <p className="text-2xl font-bold capitalize">{deal.status}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 font-medium">Commission Type</h3>
          <p className="text-2xl font-bold">{deal.commissionType}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-700 font-semibold mb-4">Daily Redemptions</h3>
          <Bar data={barData} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-700 font-semibold mb-4">Weekly Redemptions</h3>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  )
}
