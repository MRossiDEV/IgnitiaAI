import { Partner } from "../models/partner"

export const partners: Partner[] = [
  {
    id: "partner_hideaway",
    name: "Hideaway Waterfront Resort",
    companyName: "Hideaway Florida LLC",
    email: "info@hideawayflorida.com",
    phone: "+1 239 555 0101",
    website: "https://www.hideawayflorida.com",
    industry: "Hospitality",
    country: "USA",
    city: "Cape Coral",
    status: "active",
    notes: "Primary pilot partner",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-10",
  },
  {
    id: "partner_fishing",
    name: "Sunset Fishing Charters",
    email: "bookings@sunsetfishing.com",
    industry: "Tourism",
    country: "USA",
    city: "Cape Coral",
    status: "active",
    createdAt: "2025-01-05",
    updatedAt: "2025-01-05",
  },
]
