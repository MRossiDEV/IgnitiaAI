import { NextRequest, NextResponse } from "next/server"
import { createLeadFromWizard } from "@/lib/mock/leads"

/**
 * POST /api/leads
 * 
 * Creates a new lead from wizard submission
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate required fields
    if (!body.email) {
      return NextResponse.json(
        { error: "Missing required field: email" },
        { status: 400 }
      )
    }

    // Create lead using mock function
    // TODO: Replace with actual database insertion
    const lead = createLeadFromWizard({
      businessName: body.businessName,
      email: body.email,
      industry: body.industry,
      website: body.website,
      metadata: body.metadata,
    })

    console.log("Lead created:", {
      id: lead.id,
      email: lead.email,
      businessName: body.businessName,
      industry: body.industry,
    })

    return NextResponse.json(
      {
        success: true,
        id: lead.id,
        email: lead.email,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/leads
 * 
 * Retrieves all leads (for admin dashboard)
 */
export async function GET(req: NextRequest) {
  try {
    // TODO: Implement authentication check
    // const session = await auth()
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // TODO: Fetch from database
    // For now, return mock data
    const { leads } = await import("@/lib/mock/leads")

    return NextResponse.json(
      {
        success: true,
        leads: leads,
        total: leads.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS - CORS preflight
 */
export async function OPTIONS(req: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  )
}

