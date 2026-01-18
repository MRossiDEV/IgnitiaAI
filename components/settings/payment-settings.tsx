"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface PaymentSettingsProps {
  onChanged: () => void
}

export function PaymentSettings({ onChanged }: PaymentSettingsProps) {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Payment credentials are encrypted and stored securely. Never share your API keys.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Stripe Configuration</CardTitle>
          <CardDescription>
            Configure Stripe for report payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Stripe API Key</Label>
            <Input type="password" placeholder="sk_live_..." onChange={onChanged} />
          </div>
          <div className="space-y-2">
            <Label>Stripe Webhook Secret</Label>
            <Input type="password" placeholder="whsec_..." onChange={onChanged} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paxum Configuration</CardTitle>
          <CardDescription>
            Configure Paxum for partner payouts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Paxum API Key</Label>
            <Input type="password" placeholder="Enter Paxum API key" onChange={onChanged} />
          </div>
          <div className="space-y-2">
            <Label>Paxum Email</Label>
            <Input type="email" placeholder="payout@example.com" onChange={onChanged} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & Commissions</CardTitle>
          <CardDescription>
            Configure default pricing and commission structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Report Price</Label>
            <Input type="number" defaultValue="500" onChange={onChanged} />
          </div>
          <div className="space-y-2">
            <Label>Commission Type</Label>
            <Select defaultValue="percentage" onValueChange={onChanged}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Commission Value</Label>
            <Input type="number" defaultValue="10" onChange={onChanged} />
            <p className="text-xs text-muted-foreground">10% or $10 depending on type</p>
          </div>
          <div className="space-y-2">
            <Label>Tax Rate (%)</Label>
            <Input type="number" defaultValue="0" step="0.1" onChange={onChanged} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Discount Codes</Label>
              <p className="text-sm text-muted-foreground">Allow promotional discount codes</p>
            </div>
            <Switch defaultChecked onCheckedChange={onChanged} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

