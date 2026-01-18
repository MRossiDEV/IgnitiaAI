"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Database, AlertTriangle } from "lucide-react"

interface SystemSettingsProps {
  onChanged: () => void
}

export function SystemSettings({ onChanged }: SystemSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logging & Monitoring</CardTitle>
          <CardDescription>
            Configure system logging and error tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Debug Logging</Label>
              <p className="text-sm text-muted-foreground">Log detailed debug information</p>
            </div>
            <Switch onCheckedChange={onChanged} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Error Tracking</Label>
              <p className="text-sm text-muted-foreground">Send errors to monitoring service</p>
            </div>
            <Switch defaultChecked onCheckedChange={onChanged} />
          </div>
          <div className="space-y-2">
            <Label>Log Retention (days)</Label>
            <Input type="number" defaultValue="30" onChange={onChanged} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backups</CardTitle>
          <CardDescription>
            Configure automatic database backups
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Backups</Label>
              <p className="text-sm text-muted-foreground">Daily automated backups</p>
            </div>
            <Switch defaultChecked onCheckedChange={onChanged} />
          </div>
          <div className="space-y-2">
            <Label>Backup Retention (days)</Label>
            <Input type="number" defaultValue="7" onChange={onChanged} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Last Backup</p>
              <p className="text-sm text-muted-foreground">2 hours ago</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
          <Button variant="outline" className="w-full">
            <Database className="mr-2 h-4 w-4" />
            Create Manual Backup
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>
            Configure alerts for system events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Alerts</Label>
              <p className="text-sm text-muted-foreground">Send email for critical errors</p>
            </div>
            <Switch defaultChecked onCheckedChange={onChanged} />
          </div>
          <div className="space-y-2">
            <Label>Alert Email</Label>
            <Input type="email" defaultValue="admin@ignitia.ai" onChange={onChanged} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Slack Notifications</Label>
              <p className="text-sm text-muted-foreground">Send alerts to Slack channel</p>
            </div>
            <Switch onCheckedChange={onChanged} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Clear All Logs</p>
              <p className="text-sm text-muted-foreground">Delete all system logs</p>
            </div>
            <Button variant="destructive" size="sm">
              Clear Logs
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Reset to Defaults</p>
              <p className="text-sm text-muted-foreground">Reset all settings to factory defaults</p>
            </div>
            <Button variant="destructive" size="sm">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

