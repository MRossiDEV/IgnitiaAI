"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LeadsDealsSettingsProps {
  onChanged: () => void
}

export function LeadsDealsSettings({ onChanged }: LeadsDealsSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lead Automation</CardTitle>
          <CardDescription>
            Configure automatic lead creation and assignment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Create Lead</Label>
              <p className="text-sm text-muted-foreground">Automatically create lead from wizard submission</p>
            </div>
            <Switch defaultChecked onCheckedChange={onChanged} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>AI Insights</Label>
              <p className="text-sm text-muted-foreground">Generate report draft automatically for new leads</p>
            </div>
            <Switch defaultChecked onCheckedChange={onChanged} />
          </div>
          <div className="space-y-2">
            <Label>Lead Assignment</Label>
            <Select defaultValue="round-robin" onValueChange={onChanged}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="round-robin">Round Robin</SelectItem>
                <SelectItem value="manual">Manual Assignment</SelectItem>
                <SelectItem value="partner">Assign to Partner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure notifications for lead status changes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send email on status changes</p>
            </div>
            <Switch defaultChecked onCheckedChange={onChanged} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Send SMS for urgent updates</p>
            </div>
            <Switch onCheckedChange={onChanged} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

