"use client"

import { Users, Shield, Activity, Plus, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function UsersRolesPage() {
  return (
    <div className="p-4 md:p-6 space-y-6 w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-purple-700">Users & Roles</h1>
          <p className="text-sm text-gray-500 mt-1">Team scaling preparation</p>
        </div>
        <Button disabled>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* COMING SOON BANNER */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-sm text-purple-900">
                User management is coming in the Scale Phase
              </p>
              <p className="text-xs text-purple-700 mt-1">
                You're solo now. Build this when you're ready to hire or delegate.
              </p>
            </div>
            <Badge variant="secondary">Scale Phase</Badge>
          </div>
        </CardContent>
      </Card>

      {/* PLANNED FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Admin Users
            </CardTitle>
            <CardDescription>Team member management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              • Add team members
            </div>
            <div className="text-sm text-muted-foreground">
              • Manage access levels
            </div>
            <div className="text-sm text-muted-foreground">
              • Invite via email
            </div>
            <div className="text-sm text-muted-foreground">
              • Deactivate users
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Roles & Permissions
            </CardTitle>
            <CardDescription>Granular access control</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              • <strong>Admin:</strong> Full access
            </div>
            <div className="text-sm text-muted-foreground">
              • <strong>Sales:</strong> Leads & deals only
            </div>
            <div className="text-sm text-muted-foreground">
              • <strong>Analyst:</strong> Reports & analytics
            </div>
            <div className="text-sm text-muted-foreground">
              • Custom role creation
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" />
              Activity Logs
            </CardTitle>
            <CardDescription>Track what happens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              • User login history
            </div>
            <div className="text-sm text-muted-foreground">
              • Lead changes
            </div>
            <div className="text-sm text-muted-foreground">
              • Report generation
            </div>
            <div className="text-sm text-muted-foreground">
              • Payment events
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CURRENT USER */}
      <Card>
        <CardHeader>
          <CardTitle>Current User</CardTitle>
          <CardDescription>You're the only admin right now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
              A
            </div>
            <div className="flex-1">
              <div className="font-medium">Admin User</div>
              <div className="text-sm text-muted-foreground">admin@ignitia.ai</div>
            </div>
            <Badge className="bg-purple-600">Super Admin</Badge>
          </div>
        </CardContent>
      </Card>

      {/* BENEFITS */}
      <Card>
        <CardHeader>
          <CardTitle>Why Build This Early</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
            <div>
              <p className="font-medium text-sm">Avoid Rebuilding Later</p>
              <p className="text-xs text-muted-foreground">
                User management is hard to retrofit. Plan the structure now.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
            <div>
              <p className="font-medium text-sm">Scale Smoothly</p>
              <p className="text-xs text-muted-foreground">
                When you hire, just activate this section instead of scrambling
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
            <div>
              <p className="font-medium text-sm">Security & Compliance</p>
              <p className="text-xs text-muted-foreground">
                Proper access control protects your business and customers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

