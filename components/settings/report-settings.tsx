"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ReportSettingsProps {
  onChanged: () => void
}

export function ReportSettings({ onChanged }: ReportSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Free Report Configuration</CardTitle>
          <CardDescription>
            Configure sections and features for free reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Revenue Snapshot</Label>
              <p className="text-sm text-muted-foreground">Include revenue analysis</p>
            </div>
            <Switch defaultChecked onCheckedChange={onChanged} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Quick Wins</Label>
              <p className="text-sm text-muted-foreground">Show quick improvement opportunities</p>
            </div>
            <Switch defaultChecked onCheckedChange={onChanged} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Basic Analysis</Label>
              <p className="text-sm text-muted-foreground">Include basic business analysis</p>
            </div>
            <Switch defaultChecked onCheckedChange={onChanged} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paid Report Configuration</CardTitle>
          <CardDescription>
            Configure sections for the $500 Growth Blueprint
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Report Price</Label>
            <Input type="number" defaultValue="500" onChange={onChanged} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Upsell</Label>
              <p className="text-sm text-muted-foreground">Show upsell offer in free reports</p>
            </div>
            <Switch defaultChecked onCheckedChange={onChanged} />
          </div>
          <div className="space-y-2">
            <Label>Upsell Message</Label>
            <Textarea 
              defaultValue="Unlock your complete Growth Blueprint for $500" 
              onChange={onChanged}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PDF Styling</CardTitle>
          <CardDescription>
            Customize the appearance of generated reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex gap-2">
                <Input type="color" defaultValue="#7C3AED" onChange={onChanged} className="w-20" />
                <Input defaultValue="#7C3AED" onChange={onChanged} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <div className="flex gap-2">
                <Input type="color" defaultValue="#1F2937" onChange={onChanged} className="w-20" />
                <Input defaultValue="#1F2937" onChange={onChanged} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Input defaultValue="Inter" onChange={onChanged} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

