"use client"

import { Zap, Mail, Tag, Bell, Plus, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AutomationsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6 w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-purple-700">Automations</h1>
          <p className="text-sm text-gray-500 mt-1">Scale without people</p>
        </div>
        <Button disabled>
          <Plus className="w-4 h-4 mr-2" />
          Create Automation
        </Button>
      </div>

      {/* COMING SOON BANNER */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-sm text-purple-900">
                Automations are coming in the Scale Phase
              </p>
              <p className="text-xs text-purple-700 mt-1">
                Focus on MVP features first. This will be available once core functionality is proven.
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
              <Mail className="h-5 w-5" />
              Email Automations
            </CardTitle>
            <CardDescription>Automated email sequences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              • Audit delivery emails
            </div>
            <div className="text-sm text-muted-foreground">
              • Follow-up sequences
            </div>
            <div className="text-sm text-muted-foreground">
              • Payment reminders
            </div>
            <div className="text-sm text-muted-foreground">
              • Nurture campaigns
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Tag className="h-5 w-5" />
              Lead Rules
            </CardTitle>
            <CardDescription>Automatic lead management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              • Auto-tagging by industry
            </div>
            <div className="text-sm text-muted-foreground">
              • Auto-status changes
            </div>
            <div className="text-sm text-muted-foreground">
              • Priority assignment
            </div>
            <div className="text-sm text-muted-foreground">
              • Lead scoring
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5" />
              Internal Alerts
            </CardTitle>
            <CardDescription>Stay informed automatically</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              • Slack notifications
            </div>
            <div className="text-sm text-muted-foreground">
              • Email alerts
            </div>
            <div className="text-sm text-muted-foreground">
              • Hot lead notifications
            </div>
            <div className="text-sm text-muted-foreground">
              • Payment alerts
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BENEFITS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Why Automations Matter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
            <div>
              <p className="font-medium text-sm">Save Time</p>
              <p className="text-xs text-muted-foreground">
                Every automation = hours saved per week
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
            <div>
              <p className="font-medium text-sm">Increase Consistency</p>
              <p className="text-xs text-muted-foreground">
                Never miss a follow-up or forget to send a report
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
            <div>
              <p className="font-medium text-sm">Scale Effortlessly</p>
              <p className="text-xs text-muted-foreground">
                Handle 10x more leads without hiring
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

