"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"

interface IntegrationSettingsProps {
  onChanged: () => void
}

export function IntegrationSettings({ onChanged }: IntegrationSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Service</CardTitle>
          <CardDescription>
            Configure email delivery for reports and notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email Provider</Label>
            <Select defaultValue="sendgrid" onValueChange={onChanged}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sendgrid">SendGrid</SelectItem>
                <SelectItem value="mailgun">Mailgun</SelectItem>
                <SelectItem value="resend">Resend</SelectItem>
                <SelectItem value="ses">Amazon SES</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input type="password" placeholder="Enter API key" onChange={onChanged} />
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Connected</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>
            Track platform usage and performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Analytics Service</Label>
            <Select defaultValue="google_analytics" onValueChange={onChanged}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google_analytics">Google Analytics</SelectItem>
                <SelectItem value="plausible">Plausible</SelectItem>
                <SelectItem value="matomo">Matomo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tracking ID</Label>
            <Input placeholder="G-XXXXXXXXXX" onChange={onChanged} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CRM Integration</CardTitle>
          <CardDescription>
            Sync leads and deals with your CRM
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>CRM Service</Label>
            <Select onValueChange={onChanged}>
              <SelectTrigger>
                <SelectValue placeholder="Select CRM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hubspot">HubSpot</SelectItem>
                <SelectItem value="salesforce">Salesforce</SelectItem>
                <SelectItem value="pipedrive">Pipedrive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Export Leads</Label>
              <p className="text-sm text-muted-foreground">Automatically sync new leads to CRM</p>
            </div>
            <Switch onCheckedChange={onChanged} />
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Not configured</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>OSINT API Keys</CardTitle>
          <CardDescription>
            Configure API keys for data enrichment services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Clearbit API Key</Label>
            <Input type="password" placeholder="sk_..." onChange={onChanged} />
          </div>
          <div className="space-y-2">
            <Label>Hunter.io API Key</Label>
            <Input type="password" placeholder="..." onChange={onChanged} />
          </div>
          <div className="space-y-2">
            <Label>BuiltWith API Key</Label>
            <Input type="password" placeholder="..." onChange={onChanged} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

