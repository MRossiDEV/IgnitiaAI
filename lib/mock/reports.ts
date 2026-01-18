import { Report } from "../models/reports"

export const reports: Report[] = [
  {
    id: "report_snapshot_001",
    leadId: "lead_001",
    businessName: "Hideaway Waterfront Resort",
    industry: "Hospitality",
    website: "https://hideawayflorida.com",

    type: "snapshot",
    status: "generated",

    aiConfidenceScore: 87,

    revenueModel: {
      estimatedMonthlyLoss: {
        low: 4200,
        high: 8600,
      },
      breakdown: [
        {
          category: "leads",
          estimatedLoss: 1800,
          confidence: 82,
        },
        {
          category: "conversion",
          estimatedLoss: 2600,
          confidence: 78,
        },
        {
          category: "follow_up",
          estimatedLoss: 1400,
          confidence: 74,
        },
        {
          category: "offer",
          estimatedLoss: 2800,
          confidence: 69,
        },
      ],
    },

    bottlenecks: [
      {
        id: "b1",
        title: "Unqualified traffic",
        description:
          "Traffic is not segmented by intent, leading to low booking conversion.",
        impact: "high",
        category: "traffic",
      },
      {
        id: "b2",
        title: "No automated follow-up",
        description:
          "Leads that don’t book immediately are not nurtured.",
        impact: "medium",
        category: "system",
      },
    ],

    benchmarks: [
      {
        metric: "Website Conversion Rate",
        yourScore: 1.8,
        industryAverage: 3.2,
        topPerformers: 5.6,
      },
      {
        metric: "Lead Response Time (hours)",
        yourScore: 18,
        industryAverage: 4,
        topPerformers: 1,
      },
    ],

    recommendations: [
      {
        id: "r1",
        title: "Segment high-intent visitors",
        summary:
          "Introduce intent-based landing paths for booking-focused visitors.",
      },
      {
        id: "r2",
        title: "Automate abandoned booking follow-ups",
        summary:
          "Recover lost bookings with automated reminders and incentives.",
      },
    ],

    createdAt: "2025-01-15",
    updatedAt: "2025-01-15",
  },

  {
    id: "report_blueprint_001",
    leadId: "lead_001",
    businessName: "Hideaway Waterfront Resort",
    industry: "Hospitality",
    website: "https://hideawayflorida.com",

    type: "blueprint",
    status: "generated",

    aiConfidenceScore: 92,

    revenueModel: {
      estimatedMonthlyLoss: {
        low: 4200,
        high: 8600,
      },
      breakdown: [
        {
          category: "leads",
          estimatedLoss: 1800,
          confidence: 85,
        },
        {
          category: "conversion",
          estimatedLoss: 2600,
          confidence: 82,
        },
        {
          category: "follow_up",
          estimatedLoss: 1400,
          confidence: 79,
        },
        {
          category: "offer",
          estimatedLoss: 2800,
          confidence: 75,
        },
      ],
    },

    bottlenecks: [
      {
        id: "b1",
        title: "Unqualified traffic",
        description:
          "Traffic sources are not aligned with booking-ready intent.",
        impact: "high",
        category: "traffic",
      },
      {
        id: "b2",
        title: "Manual follow-up process",
        description:
          "Manual follow-ups cause delayed responses and lost bookings.",
        impact: "high",
        category: "system",
      },
    ],

    benchmarks: [
      {
        metric: "Website Conversion Rate",
        yourScore: 1.8,
        industryAverage: 3.2,
        topPerformers: 5.6,
      },
      {
        metric: "Lead Response Time (hours)",
        yourScore: 18,
        industryAverage: 4,
        topPerformers: 1,
      },
    ],

    recommendations: [
      {
        id: "r1",
        title: "High-intent booking funnel",
        summary:
          "Create dedicated booking funnels for search and referral traffic.",
        estimatedImpact: 3200,
        executionDifficulty: "medium",
        priority: 1,
      },
      {
        id: "r2",
        title: "Automated booking recovery system",
        summary:
          "Recover abandoned bookings via email + SMS automation.",
        estimatedImpact: 2400,
        executionDifficulty: "easy",
        priority: 2,
      },
    ],

    funnelModel: {
      stages: [
        {
          name: "Discovery",
          description: "Visitor discovers the property.",
          optimizationGoal: "Qualify intent quickly.",
        },
        {
          name: "Booking Intent",
          description: "Visitor checks availability or pricing.",
          optimizationGoal: "Reduce friction.",
        },
        {
          name: "Follow-Up",
          description: "Recover undecided visitors.",
          optimizationGoal: "Automate engagement.",
        },
      ],
    },

    automationPlan: {
      triggers: [
        {
          event: "Booking abandoned",
          action: "Send reminder email",
          delay: "1 hour",
        },
        {
          event: "No response",
          action: "Send SMS incentive",
          delay: "24 hours",
        },
      ],
    },

    createdAt: "2025-01-15",
    updatedAt: "2025-01-15",
  },
]
