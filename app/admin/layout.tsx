"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded-lg font-medium transition ${
      pathname.startsWith(path)
        ? "bg-purple-100 text-purple-700"
        : "hover:bg-purple-50 text-gray-700"
    }`

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-purple-700">Ignitia AI</h2>
          <p className="text-sm text-gray-500">Growth Intelligence Platform</p>
        </div>


        <nav className="p-4 space-y-1 flex-1">
          {/* MVP CORE */}
          <Link href="/admin" className={linkClass("/admin")}>📊 Dashboard</Link>
          <Link href="/admin/leads" className={linkClass("/admin/leads")}>🎯 Leads</Link>
          <Link href="/admin/audits" className={linkClass("/admin/audits")}>📋 Audits & Reports</Link>
          <Link href="/admin/payments" className={linkClass("/admin/payments")}>💰 Payments</Link>

          {/* SCALE PHASE */}
          <div className="pt-2 mt-2 border-t border-gray-200">
            <p className="text-xs text-gray-400 px-2 mb-1">GROWTH</p>
            <Link href="/admin/funnels" className={linkClass("/admin/funnels")}>🎯 Funnels & Offers</Link>
            <Link href="/admin/analytics" className={linkClass("/admin/analytics")}>📊 Analytics</Link>
            <Link href="/admin/automations" className={linkClass("/admin/automations")}>⚡ Automations</Link>
          </div>

          {/* TEAM & CONTENT */}
          <div className="pt-2 mt-2 border-t border-gray-200">
            <p className="text-xs text-gray-400 px-2 mb-1">TEAM</p>
            <Link href="/admin/content" className={linkClass("/admin/content")}>📝 Content & Templates</Link>
            <Link href="/admin/users" className={linkClass("/admin/users")}>👥 Users & Roles</Link>
          </div>

          {/* LEGACY (Hidden but accessible) */}
          <div className="pt-2 mt-2 border-t border-gray-200">
            <p className="text-xs text-gray-400 px-2 mb-1">LEGACY</p>
            <Link href="/admin/partners" className={linkClass("/admin/partners")}>🤝 Partners</Link>
            <Link href="/admin/deals" className={linkClass("/admin/deals")}>💼 Deals</Link>
          </div>
        </nav>

        <div className="p-4 border-t space-y-3">
          <Link href="/admin/settings" className={linkClass("/admin/settings")}>⚙️ Settings</Link>

          {/* User Info */}
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 px-2 py-1 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span className="truncate">{user?.profile?.full_name || user?.email}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <div className="text-xs text-gray-400">v0.1 • ©2026 MRossiDev </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}
