"use client"

export default function NewDealPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Create Deal</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Deal Title" />

        <select className="w-full border rounded-lg px-3 py-2">
          <option>Percentage Discount</option>
          <option>Fixed Amount</option>
          <option>Free Add-on</option>
        </select>

        <input className="w-full border rounded-lg px-3 py-2" placeholder="Value (e.g. 10%, $20)" />

        <textarea
          rows={3}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Deal description shown to guests"
        />

        <input className="w-full border rounded-lg px-3 py-2" placeholder="Redemption instructions" />

        <select className="w-full border rounded-lg px-3 py-2">
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
          Save Deal
        </button>
      </div>
    </div>
  )
}
