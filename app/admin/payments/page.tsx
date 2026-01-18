"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { reports as mockReports } from "@/lib/mock/reports"
import { leads as mockLeads } from "@/lib/mock/leads"
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Search,
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
import Link from "next/link"

// Mock payment data
interface Payment {
  id: string
  reportId: string
  leadId: string
  amount: number
  status: "pending" | "completed" | "failed"
  paymentMethod: string
  createdAt: string
  completedAt?: string
}

const mockPayments: Payment[] = [
  {
    id: "pay_001",
    reportId: "report_blueprint_001",
    leadId: "lead_001",
    amount: 500,
    status: "completed",
    paymentMethod: "Credit Card",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pay_002",
    reportId: "report_blueprint_002",
    leadId: "lead_002",
    amount: 500,
    status: "completed",
    paymentMethod: "Credit Card",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pay_003",
    reportId: "report_blueprint_003",
    leadId: "lead_003",
    amount: 500,
    status: "pending",
    paymentMethod: "Credit Card",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pay_004",
    reportId: "report_blueprint_004",
    leadId: "lead_004",
    amount: 500,
    status: "failed",
    paymentMethod: "Credit Card",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function PaymentsPage() {
  const router = useRouter()
  const [payments] = useState<Payment[]>(mockPayments)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Filter payments
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const lead = mockLeads.find((l) => l.id === payment.leadId)
      const matchesSearch =
        searchQuery === "" ||
        payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead?.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = filterStatus === "all" || payment.status === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [payments, searchQuery, filterStatus])

  // Analytics
  const analytics = useMemo(() => {
    const totalRevenue = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0)

    const pendingRevenue = payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0)

    const completedPayments = payments.filter((p) => p.status === "completed").length
    const pendingPayments = payments.filter((p) => p.status === "pending").length
    const failedPayments = payments.filter((p) => p.status === "failed").length

    // Calculate monthly revenue (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const monthlyRevenue = payments
      .filter((p) => p.status === "completed" && new Date(p.createdAt) >= thirtyDaysAgo)
      .reduce((sum, p) => sum + p.amount, 0)

    // Calculate conversion rate (free audits to paid blueprints)
    const freeAudits = mockReports.filter((r) => r.type === "snapshot").length
    const paidBlueprints = mockReports.filter((r) => r.type === "blueprint").length
    const conversionRate = freeAudits > 0 ? ((paidBlueprints / freeAudits) * 100).toFixed(1) : "0"

    return {
      totalRevenue,
      pendingRevenue,
      completedPayments,
      pendingPayments,
      failedPayments,
      monthlyRevenue,
      conversionRate,
    }
  }, [payments])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6 w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-purple-700">Payments & Revenue</h1>
          <p className="text-sm text-gray-500 mt-1">Know exactly where money comes from</p>
        </div>
        <Button variant="outline" onClick={() => {}}>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.completedPayments} completed payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Free → Paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.pendingRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.pendingPayments} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FAILED PAYMENTS ALERT */}
      {analytics.failedPayments > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm text-orange-900">
                  {analytics.failedPayments} failed payment{analytics.failedPayments !== 1 ? "s" : ""} need attention
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  Review and retry failed payments to recover revenue
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setFilterStatus("failed")}>
                Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by payment ID, customer name, or email..."
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
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* PAYMENTS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            {filteredPayments.length} transaction{filteredPayments.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => {
                const lead = mockLeads.find((l) => l.id === payment.leadId)
                const report = mockReports.find((r) => r.id === payment.reportId)
                return (
                  <TableRow key={payment.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead?.name || "Unknown"}</div>
                        <div className="text-xs text-muted-foreground">{lead?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">${payment.amount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        {payment.paymentMethod}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/payments/${payment.id}`)}
                      >
                        View
                      </Button>
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

