"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { leads } from "@/lib/mock/leads"
import { partners } from "@/lib/mock/partners"
import { deals } from "@/lib/mock/deals"
import { reports } from "@/lib/mock/reports"
import {
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  AlertCircle,
  Plus,
  Clock,
  Target,
  ArrowUpRight,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function AdminDashboard() {
  const router = useRouter()

  // -----------------------
  // TOP KPIs
  // -----------------------
  const totalLeads = leads.length
  const newLeadsLast7Days = leads.filter(l => {
    const createdDate = new Date(l.createdAt)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return createdDate >= sevenDaysAgo
  }).length

  const newLeadsLast30Days = leads.filter(l => {
    const createdDate = new Date(l.createdAt)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    return createdDate >= thirtyDaysAgo
  }).length

  const convertedLeads = leads.filter(l => l.status === "converted").length
  const conversionRate = totalLeads ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0"

  const paidBlueprints = reports.filter(r => r.type === "blueprint").length
  const revenue = paidBlueprints * 500 // Assuming $500 per blueprint

  const activeAudits = reports.filter(r => r.status === "draft" || r.status === "generated").length

  // -----------------------
  // PIPELINE SNAPSHOT
  // -----------------------
  const pipelineStages = [
    { status: "new", count: leads.filter(l => l.status === "new").length },
    { status: "contacted", count: leads.filter(l => l.status === "contacted").length },
    { status: "qualified", count: leads.filter(l => l.status === "qualified").length },
    { status: "converted", count: leads.filter(l => l.status === "converted").length },
    { status: "lost", count: leads.filter(l => l.status === "lost").length },
  ]

  // -----------------------
  // URGENT ACTIONS
  // -----------------------
  const leadsNotContactedIn7Days = leads.filter(l => {
    if (!l.lastContactedAt) return l.status !== "new" && l.status !== "converted" && l.status !== "lost"
    const lastContact = new Date(l.lastContactedAt)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return lastContact < sevenDaysAgo && l.status !== "converted" && l.status !== "lost"
  })

  const pendingReports = reports.filter(r => r.status === "draft")

  const hotLeads = leads.filter(l => l.priority === "hot" && l.status !== "converted" && l.status !== "lost")

  return (
    <div className="p-4 md:p-6 space-y-6 w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-purple-700">Command Center</h1>
          <p className="text-sm text-gray-500 mt-1">Instant clarity on what matters today</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/admin/leads/new")} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
          <Button onClick={() => router.push("/admin/audits/new")} size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* TOP KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads (7d)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newLeadsLast7Days}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {newLeadsLast30Days} in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {convertedLeads} converted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (Paid Blueprints)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {paidBlueprints} blueprints sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Audits</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAudits}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* PIPELINE SNAPSHOT */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Snapshot</CardTitle>
          <CardDescription>Leads per stage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {pipelineStages.map((stage) => (
              <Link
                key={stage.status}
                href={`/admin/leads?status=${stage.status}`}
                className="flex-1 min-w-[120px] p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
              >
                <div className="text-xs text-purple-600 font-medium uppercase mb-1">
                  {stage.status}
                </div>
                <div className="text-2xl font-bold text-purple-900">{stage.count}</div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* URGENT ACTIONS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Urgent Actions
            </CardTitle>
            <CardDescription>What needs attention now</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {leadsNotContactedIn7Days.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-orange-900">
                    {leadsNotContactedIn7Days.length} leads not contacted in 7+ days
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-orange-600"
                    onClick={() => router.push("/admin/leads?filter=stale")}
                  >
                    Review now →
                  </Button>
                </div>
              </div>
            )}

            {pendingReports.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-blue-900">
                    {pendingReports.length} pending reports to review
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-blue-600"
                    onClick={() => router.push("/admin/audits?status=draft")}
                  >
                    Review now →
                  </Button>
                </div>
              </div>
            )}

            {hotLeads.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <TrendingUp className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-red-900">
                    {hotLeads.length} hot leads need follow-up
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-red-600"
                    onClick={() => router.push("/admin/leads?priority=hot")}
                  >
                    Follow up →
                  </Button>
                </div>
              </div>
            )}

            {leadsNotContactedIn7Days.length === 0 && pendingReports.length === 0 && hotLeads.length === 0 && (
              <div className="flex items-center gap-2 p-4 text-center justify-center text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <p className="text-sm font-medium">All caught up! 🎉</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* QUICK ACTIONS */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push("/admin/leads/new")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Lead
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push("/admin/audits/new")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Create Report
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push("/admin/leads?filter=followup")}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Send Follow-up
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
