"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { reports as mockReports } from "@/lib/mock/reports"
import { leads as mockLeads } from "@/lib/mock/leads"
import { Report } from "@/lib/models/reports"
import {
  FileText,
  Search,
  Plus,
  Download,
  Send,
  Edit,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function AuditsReportsPage() {
  const router = useRouter()
  const [reports] = useState<Report[]>(mockReports)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        searchQuery === "" ||
        report.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.industry?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = filterStatus === "all" || report.status === filterStatus
      const matchesType = filterType === "all" || report.type === filterType

      return matchesSearch && matchesStatus && matchesType
    })
  }, [reports, searchQuery, filterStatus, filterType])

  // Analytics
  const analytics = useMemo(() => {
    const freeAudits = reports.filter((r) => r.type === "snapshot").length
    const paidBlueprints = reports.filter((r) => r.type === "blueprint").length
    const pendingReports = reports.filter((r) => r.status === "draft").length
    const deliveredReports = reports.filter((r) => r.status === "delivered").length
    const revenue = paidBlueprints * 500

    return {
      freeAudits,
      paidBlueprints,
      pendingReports,
      deliveredReports,
      revenue,
    }
  }, [reports])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Draft</Badge>
      case "generated":
        return <Badge variant="default"><CheckCircle2 className="w-3 h-3 mr-1" />Generated</Badge>
      case "delivered":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Send className="w-3 h-3 mr-1" />Delivered
        </Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    return type === "snapshot" ? (
      <Badge variant="outline">Free Audit</Badge>
    ) : (
      <Badge className="bg-purple-600">Paid Blueprint</Badge>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-purple-700">Audits & Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Manage what users receive</p>
        </div>
        <Button onClick={() => router.push("/admin/audits/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Create Report
        </Button>
      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Audits</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.freeAudits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Blueprints</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.paidBlueprints}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pendingReports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.deliveredReports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From blueprints</p>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by business name or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="generated">Generated</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="snapshot">Free Audit</SelectItem>
            <SelectItem value="blueprint">Paid Blueprint</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* REPORTS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
          <CardDescription>
            {filteredReports.length} report{filteredReports.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => {
                const lead = mockLeads.find((l) => l.id === report.leadId)
                return (
                  <TableRow key={report.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{report.businessName}</TableCell>
                    <TableCell>{report.industry || "—"}</TableCell>
                    <TableCell>{getTypeBadge(report.type)}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="text-sm">{report.aiConfidenceScore}%</div>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600"
                            style={{ width: `${report.aiConfidenceScore}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

