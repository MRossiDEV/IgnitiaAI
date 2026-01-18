"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { partners as mockPartners } from "@/lib/mock/partners"

interface PartnerFormProps {
  partner?: typeof mockPartners[0]
}

export default function PartnerForm({ partner }: PartnerFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: partner?.name || "",
    companyName: partner?.companyName || "",
    email: partner?.email || "",
    phone: partner?.phone || "",
    website: partner?.website || "",
    industry: partner?.industry || "",
    country: partner?.country || "",
    city: partner?.city || "",
    notes: partner?.notes || "",
    status: partner?.status || "active",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For now just log the new or updated partner
    console.log("Submitted partner:", form)
    alert("Partner saved! (mock only)")
    router.push("/admin/partners")
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{partner ? "Edit Partner" : "Add New Partner"}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          type="text"
          name="name"
          placeholder="Partner Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="url"
          name="website"
          placeholder="Website"
          value={form.website}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="industry"
          placeholder="Industry"
          value={form.industry}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
          Save Partner
        </button>
      </form>
    </div>
  )
}
