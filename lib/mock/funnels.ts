import { Funnel } from "../models/funnels"

export const funnels: Funnel[] = [
  {
    id: "funnel_001",
    dealId: "deal_hideaway_loyalty",
    name: "Hideaway Loyalty Funnel",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15",
    steps: [
      { id: "step_hero", type: "hero", content: "Welcome to Hideaway Loyalty!", order: 1 },
      { id: "step_features", type: "features", content: "Exclusive offers and discounts.", order: 2 },
      { id: "step_form", type: "form", content: "Capture email and info here", order: 3 },
      { id: "step_cta", type: "cta", content: "Book Now!", order: 4 },
    ],
  },
]
