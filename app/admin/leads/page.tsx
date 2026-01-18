"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { leads as mockLeads } from "@/lib/mock/leads"
import { Lead, LeadStatus, LeadPriority } from "@/lib/models/lead"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import {
  Search,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  AlertCircle,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { toast } from "sonner"
import { LeadCardComponent } from "./components/LeadCard"
import { DroppableColumn } from "./components/DroppableColumn"

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSource, setFilterSource] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [activeId, setActiveId] = useState<string | null>(null)
  const router = useRouter()

  const statuses: LeadStatus[] = ["new", "contacted", "qualified", "converted", "lost"]

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let filtered = leads.filter((lead) => {
      const matchesSearch =
        searchQuery === "" ||
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSource = filterSource === "all" || lead.source === filterSource
      const matchesPriority = filterPriority === "all" || lead.priority === filterPriority

      return matchesSearch && matchesSource && matchesPriority
    })

    // Sort leads
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "value":
          return (b.estimatedValue || 0) - (a.estimatedValue || 0)
        case "lastContacted":
          const aTime = a.lastContactedAt ? new Date(a.lastContactedAt).getTime() : 0
          const bTime = b.lastContactedAt ? new Date(b.lastContactedAt).getTime() : 0
          return bTime - aTime
        default:
          return 0
      }
    })

    return filtered
  }, [leads, searchQuery, filterSource, filterPriority, sortBy])

  // Group leads by status
  const groupedLeads = useMemo(() => {
    return statuses.reduce((acc, status) => {
      acc[status] = filteredLeads.filter((lead) => lead.status === status)
      return acc
    }, {} as Record<LeadStatus, Lead[]>)
  }, [filteredLeads, statuses])

  // Calculate analytics
  const analytics = useMemo(() => {
    const total = leads.length
    const converted = leads.filter((l) => l.status === "converted").length
    const conversionRate = total > 0 ? (converted / total) * 100 : 0
    const totalRevenue = leads
      .filter((l) => l.status === "converted")
      .reduce((sum, l) => sum + (l.actualValue || l.estimatedValue || 0), 0)
    const potentialRevenue = leads
      .filter((l) => l.status !== "converted" && l.status !== "lost")
      .reduce((sum, l) => sum + (l.estimatedValue || 0), 0)

    return {
      total,
      converted,
      conversionRate,
      totalRevenue,
      potentialRevenue,
      byStatus: statuses.map((status) => ({
        status,
        count: leads.filter((l) => l.status === status).length,
      })),
    }
  }, [leads, statuses])

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const leadId = active.id as string
    const newStatus = over.id as LeadStatus

    const lead = leads.find((l) => l.id === leadId)
    if (!lead || lead.status === newStatus) return

    // Optimistic update
    setLeads((prevLeads) =>
      prevLeads.map((l) =>
        l.id === leadId
          ? {
              ...l,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              ...(newStatus === "converted" && !l.convertedAt
                ? { convertedAt: new Date().toISOString() }
                : {}),
            }
          : l
      )
    )

    // Show feedback
    toast.success(`Lead moved to ${newStatus} ✅`)

    // Update via API
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update lead")
      }
    } catch (error) {
      console.error("Error updating lead:", error)
      toast.error("Failed to update lead status")
      // Revert on error
      setLeads(mockLeads)
    }
  }

  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-4 md:p-6 space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-700">CRM Dashboard</h1>
          <Button onClick={() => router.push("/admin/leads/new")} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all stages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.converted} converted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${analytics.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From converted leads
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${analytics.potentialRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                In pipeline
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="audit">Audit</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="campaign">Campaign</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="hot">Hot</SelectItem>
              <SelectItem value="warm">Warm</SelectItem>
              <SelectItem value="cold">Cold</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="value">Highest Value</SelectItem>
              <SelectItem value="lastContacted">Last Contacted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 w-full overflow-x-auto pb-4">
          {statuses.map((status) => {
            const statusLeads = groupedLeads[status]
            const statusValue = statusLeads.reduce(
              (sum, lead) => sum + (lead.estimatedValue || 0),
              0
            )

            return (
              <div
                key={status}
                className="flex-1 min-w-[280px] md:min-w-[320px] flex flex-col"
              >
                {/* Column Header */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold capitalize flex items-center gap-2">
                      {status}
                      <Badge variant="secondary" className="ml-2">
                        {statusLeads.length}
                      </Badge>
                    </h2>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <button className="text-muted-foreground hover:text-foreground">
                          <AlertCircle className="h-4 w-4" />
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold capitalize">{status} Stage</h4>
                          <p className="text-sm text-muted-foreground">
                            {status === "new" &&
                              "Fresh leads that haven't been contacted yet. Prioritize hot leads."}
                            {status === "contacted" &&
                              "Leads that have been reached out to. Follow up regularly."}
                            {status === "qualified" &&
                              "Leads that show strong interest. Move to close the deal."}
                            {status === "converted" &&
                              "Successfully closed deals. Focus on onboarding."}
                            {status === "lost" &&
                              "Leads that didn't convert. Review for future opportunities."}
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  {statusValue > 0 && (
                    <p className="text-sm text-muted-foreground">
                      ${statusValue.toLocaleString()} potential
                    </p>
                  )}
                </div>

                {/* Droppable Column */}
                <DroppableColumn
                  id={status}
                  className="flex-1 space-y-3 min-h-[200px] bg-muted/20 rounded-lg p-3"
                >
                  <SortableContext
                    items={statusLeads.map((l) => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {statusLeads.length === 0 ? (
                      <Empty className="border-dashed">
                        <EmptyHeader>
                          <EmptyTitle className="text-base">No {status} leads</EmptyTitle>
                          <EmptyDescription className="text-sm">
                            {status === "new"
                              ? "Add a new lead to get started"
                              : `Drag leads here to mark as ${status}`}
                          </EmptyDescription>
                        </EmptyHeader>
                        {status === "new" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push("/admin/leads/new")}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Lead
                          </Button>
                        )}
                      </Empty>
                    ) : (
                      statusLeads.map((lead) => (
                        <LeadCardComponent
                          key={lead.id}
                          lead={lead}
                          onUpdate={(updatedLead) => {
                            setLeads((prev) =>
                              prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
                            )
                          }}
                        />
                      ))
                    )}
                  </SortableContext>
                </DroppableColumn>
              </div>
            )
          })}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeLead ? (
            <div className="bg-white rounded-xl shadow-2xl p-4 border-2 border-purple-500 opacity-90 w-[280px]">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-purple-700">{activeLead.name}</h3>
                {activeLead.priority && (
                  <Badge
                    variant={
                      activeLead.priority === "hot"
                        ? "destructive"
                        : activeLead.priority === "warm"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {activeLead.priority}
                  </Badge>
                )}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
}
