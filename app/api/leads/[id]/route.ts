import { NextRequest, NextResponse } from "next/server"
import { leads } from "@/lib/mock/leads"
import { LeadStatus, LeadPriority } from "@/lib/models/lead"

/**
 * PATCH /api/leads/[id]
 * 
 * Updates a lead's properties (status, priority, notes, etc.)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    // Find the lead
    const leadIndex = leads.findIndex((l) => l.id === id)
    if (leadIndex === -1) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      )
    }

    const lead = leads[leadIndex]

    // Update allowed fields
    if (body.status && ["new", "contacted", "qualified", "converted", "lost"].includes(body.status)) {
      lead.status = body.status as LeadStatus
      
      // Auto-set convertedAt if status changed to converted
      if (body.status === "converted" && !lead.convertedAt) {
        lead.convertedAt = new Date().toISOString()
      }
    }

    if (body.priority && ["hot", "warm", "cold"].includes(body.priority)) {
      lead.priority = body.priority as LeadPriority
    }

    if (body.notes !== undefined) {
      lead.notes = body.notes
    }

    if (body.lastContactedAt) {
      lead.lastContactedAt = body.lastContactedAt
    }

    if (body.nextFollowUpAt) {
      lead.nextFollowUpAt = body.nextFollowUpAt
    }

    if (body.estimatedValue !== undefined) {
      lead.estimatedValue = body.estimatedValue
    }

    // Always update the updatedAt timestamp
    lead.updatedAt = new Date().toISOString()

    // Update the lead in the array
    leads[leadIndex] = lead

    console.log("Lead updated:", {
      id: lead.id,
      status: lead.status,
      priority: lead.priority,
    })

    return NextResponse.json(
      {
        success: true,
        lead,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating lead:", error)
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/leads/[id]
 * 
 * Retrieves a single lead by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const lead = leads.find((l) => l.id === id)
    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        lead,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching lead:", error)
    return NextResponse.json(
      { error: "Failed to fetch lead" },
      { status: 500 }
    )
  }
}

