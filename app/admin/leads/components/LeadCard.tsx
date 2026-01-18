"use client"

import { Lead } from "@/lib/models/lead"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Phone, Mail, Clock, Flame, AlertCircle, MoreVertical, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface LeadCardProps {
  lead: Lead
  onUpdate: (lead: Lead) => void
}

export function LeadCardComponent({ lead, onUpdate }: LeadCardProps) {
  const router = useRouter()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isOverdue =
    lead.nextFollowUpAt && new Date(lead.nextFollowUpAt) < new Date()

  const priorityConfig = {
    hot: { color: "destructive", icon: Flame, label: "Hot" },
    warm: { color: "default", icon: Clock, label: "Warm" },
    cold: { color: "secondary", icon: Clock, label: "Cold" },
  }

  const priority = lead.priority ? priorityConfig[lead.priority] : null

  const handleQuickAction = async (action: string, e: React.MouseEvent) => {
    e.stopPropagation()

    switch (action) {
      case "call":
        if (lead.phone) {
          window.location.href = `tel:${lead.phone}`
        }
        break
      case "email":
        window.location.href = `mailto:${lead.email}`
        break
      case "view":
        router.push(`/admin/leads/${lead.id}`)
        break
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        cursor-grab active:cursor-grabbing
        bg-white rounded-xl shadow-md p-4 
        hover:shadow-xl transition-all border border-gray-200
        ${isOverdue ? "border-l-4 border-l-red-500" : ""}
        ${priority?.color === "destructive" ? "border-l-4 border-l-orange-500" : ""}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <HoverCard>
            <HoverCardTrigger asChild>
              <h3
                className="text-base font-semibold text-purple-700 truncate cursor-pointer hover:underline"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/admin/leads/${lead.id}`)
                }}
              >
                {lead.name || "Unnamed Lead"}
              </h3>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">{lead.name}</h4>
                {lead.lastContactedAt && (
                  <p className="text-xs text-muted-foreground">
                    Last contacted:{" "}
                    {formatDistanceToNow(new Date(lead.lastContactedAt), {
                      addSuffix: true,
                    })}
                  </p>
                )}
                {lead.notes && (
                  <p className="text-xs text-muted-foreground border-t pt-2">
                    {lead.notes}
                  </p>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
          {lead.company && (
            <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
          )}
        </div>

        <div className="flex items-center gap-2 ml-2">
          {priority && (
            <Badge variant={priority.color as any} className="text-xs">
              <priority.icon className="w-3 h-3 mr-1" />
              {priority.label}
            </Badge>
          )}
          {isOverdue && (
            <Badge variant="destructive" className="text-xs animate-pulse">
              <AlertCircle className="w-3 h-3 mr-1" />
              Overdue
            </Badge>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-1.5 mb-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate text-xs">{lead.email}</span>
        </div>
        {lead.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs">{lead.phone}</span>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-xs">
            {lead.source}
          </Badge>
          {lead.industry && (
            <Badge variant="outline" className="text-xs">
              {lead.industry}
            </Badge>
          )}
        </div>
        {lead.estimatedValue && (
          <span className="font-semibold text-green-600">
            ${lead.estimatedValue.toLocaleString()}
          </span>
        )}
      </div>

      {/* Timeline Info */}
      {(lead.lastContactedAt || lead.nextFollowUpAt) && (
        <div className="space-y-1 mb-3 text-xs">
          {lead.lastContactedAt && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>
                Last contact:{" "}
                {formatDistanceToNow(new Date(lead.lastContactedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          )}
          {lead.nextFollowUpAt && (
            <div
              className={`flex items-center gap-2 ${
                isOverdue ? "text-red-600 font-semibold" : "text-muted-foreground"
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>
                Follow-up:{" "}
                {formatDistanceToNow(new Date(lead.nextFollowUpAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex items-center gap-2 pt-3 border-t">
        <button
          onClick={(e) => handleQuickAction("email", e)}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
        >
          <Mail className="w-3.5 h-3.5" />
          Email
        </button>
        {lead.phone && (
          <button
            onClick={(e) => handleQuickAction("call", e)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={(e) => e.stopPropagation()}
            className="px-2 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => handleQuickAction("view", e)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                toast.info("Quick edit coming soon!")
              }}
            >
              Quick Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                toast.info("Add note coming soon!")
              }}
            >
              Add Note
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
