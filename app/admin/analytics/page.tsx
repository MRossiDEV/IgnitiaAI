"use client"

import { useMemo } from "react"
import { leads as mockLeads } from "@/lib/mock/leads"
import { reports as mockReports } from "@/lib/mock/reports"
import {
  TrendingUp,
  Target,
  DollarSign,
  BarChart3,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AnalyticsPage() {
  const funnelData = useMemo(() => {
    const totalLeads = mockLeads.length
    const contacted = mockLeads.filter((l) => l.status !== "new").length
    const qualified = mockLeads.filter((l) => l.status === "qualified" || l.status === "converted").length
    const converted = mockLeads.filter((l) => l.status === "converted").length

    const contactedRate = totalLeads > 0 ? ((contacted / totalLeads) * 100).toFixed(1) : "0"
    const qualifiedRate = contacted > 0 ? ((qualified / contacted) * 100).toFixed(1) : "0"
    const convertedRate = qualified > 0 ? ((converted / qualified) * 100).toFixed(1) : "0"

    return {
      stages: [
        { name: "Total Leads", count: totalLeads, rate: "100%", dropOff: 0 },
        { name: "Contacted", count: contacted, rate: contactedRate + "%", dropOff: totalLeads - contacted },
        { name: "Qualified", count: qualified, rate: qualifiedRate + "%", dropOff: contacted - qualified },
        { name: "Converted", count: converted, rate: convertedRate + "%", dropOff: qualified - converted },
      ],
    }
  }, [])

  const sourcePerformance = useMemo(() => {
    const sources = ["audit", "manual", "referral", "campaign"] as const
    return sources.map((source) => {
      const sourceLeads = mockLeads.filter((l) => l.source === source)
      const converted = sourceLeads.filter((l) => l.status === "converted").length
      const conversionRate = sourceLeads.length > 0 ? ((converted / sourceLeads.length) * 100).toFixed(1) : "0"
      const revenue = converted * 500

      return {
        source,
        leads: sourceLeads.length,
        converted,
        conversionRate,
        revenue,
      }
    })
  }, [])

  const industryPerformance = useMemo(() => {
    const industries = [...new Set(mockLeads.map((l) => l.industry).filter(Boolean))] as string[]
    return industries.map((industry) => {
      const industryLeads = mockLeads.filter((l) => l.industry === industry)
      const converted = industryLeads.filter((l) => l.status === "converted").length
      const conversionRate = industryLeads.length > 0 ? ((converted / industryLeads.length) * 100).toFixed(1) : "0"
      const avgValue = industryLeads.length > 0
        ? industryLeads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0) / industryLeads.length
        : 0

      return {
        industry,
        leads: industryLeads.length,
        converted,
        conversionRate,
        avgValue: avgValue.toFixed(0),
      }
    }).sort((a, b) => b.leads - a.leads)
  }, [])

  const timeMetrics = useMemo(() => {
    const convertedLeads = mockLeads.filter((l) => l.status === "converted" && l.convertedAt)
    const times = convertedLeads.map((l) => {
      const created = new Date(l.createdAt).getTime()
      const converted = new Date(l.convertedAt!).getTime()
      return (converted - created) / (1000 * 60 * 60 * 24)
    })

    const avgTime = times.length > 0 ? (times.reduce((sum, t) => sum + t, 0) / times.length).toFixed(1) : "0"

    return {
      avgTimeToConvert: avgTime,
      totalConverted: convertedLeads.length,
    }
  }, [])

  const revenueAttribution = useMemo(() => {
    const paidReports = mockReports.filter((r) => r.type === "blueprint")
    const totalRevenue = paidReports.length * 500

    const bySource = sourcePerformance.map((s) => ({
      source: s.source,
      revenue: s.revenue,
      percentage: totalRevenue > 0 ? ((s.revenue / totalRevenue) * 100).toFixed(1) : "0",
    }))

    return {
      totalRevenue,
      bySource,
    }
  }, [sourcePerformance])

  return (
    <div className="p-4 md:p-6 space-y-6 w-full">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-purple-700">Analytics & Insights</h1>
        <p className="text-sm text-gray-500 mt-1">Understand what is working and what is leaking</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Conversion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((timeMetrics.totalConverted / mockLeads.length) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {timeMetrics.totalConverted} of {mockLeads.length} leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time to Convert</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeMetrics.avgTimeToConvert} days</div>
            <p className="text-xs text-muted-foreground mt-1">From lead to conversion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueAttribution.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From paid blueprints</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sourcePerformance.filter((s) => s.leads > 0).length}</div>
            <p className="text-xs text-muted-foreground mt-1">Lead sources generating traffic</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funnel Analytics</CardTitle>
          <CardDescription>See where leads drop off</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {funnelData.stages.map((stage, index) => (
            <div key={stage.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{stage.name}</div>
                  <Badge variant="secondary">{stage.count} leads</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{stage.rate}</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: stage.rate }}
                />
              </div>
              {stage.dropOff > 0 && (
                <div className="text-xs text-orange-600 mt-1">
                  ⚠️ {stage.dropOff} leads dropped off
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lead Source Performance</CardTitle>
          <CardDescription>Which channels convert best</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Converted</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sourcePerformance.map((source) => (
                <TableRow key={source.source}>
                  <TableCell className="font-medium capitalize">{source.source}</TableCell>
                  <TableCell>{source.leads}</TableCell>
                  <TableCell>{source.converted}</TableCell>
                  <TableCell>
                    <Badge variant={parseFloat(source.conversionRate) > 20 ? "default" : "secondary"}>
                      {source.conversionRate}%
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">${source.revenue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Industry Performance</CardTitle>
          <CardDescription>Which industries convert best</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Industry</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Converted</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Avg Lead Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {industryPerformance.map((industry) => (
                <TableRow key={industry.industry}>
                  <TableCell className="font-medium">{industry.industry}</TableCell>
                  <TableCell>{industry.leads}</TableCell>
                  <TableCell>{industry.converted}</TableCell>
                  <TableCell>
                    <Badge variant={parseFloat(industry.conversionRate) > 20 ? "default" : "secondary"}>
                      {industry.conversionRate}%
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">${industry.avgValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Attribution</CardTitle>
          <CardDescription>Where your money comes from</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {revenueAttribution.bySource.map((source) => (
            <div key={source.source}>
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium capitalize">{source.source}</div>
                <div className="text-sm text-muted-foreground">
                  ${source.revenue.toLocaleString()} ({source.percentage}%)
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${source.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

