"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, RotateCcw } from "lucide-react"
import { GeneralSettings } from "@/components/settings/general-settings"
import { AITemplatesSettings } from "@/components/settings/ai-templates-settings"
import { ReportSettings } from "@/components/settings/report-settings"
import { FunnelSettings } from "@/components/settings/funnel-settings"
import { LeadsDealsSettings } from "@/components/settings/leads-deals-settings"
import { PaymentSettings } from "@/components/settings/payment-settings"
import { IndustrySettings } from "@/components/settings/industry-settings"
import { IntegrationSettings } from "@/components/settings/integration-settings"
import { SystemSettings } from "@/components/settings/system-settings"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleSave = () => {
    // Save logic will be implemented per tab
    console.log("Saving settings...")
    setHasUnsavedChanges(false)
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to discard all unsaved changes?")) {
      setHasUnsavedChanges(false)
      // Reset logic
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Configure your platform, AI templates, reports, and integrations
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
            <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-9 lg:w-auto lg:inline-grid">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="ai">AI & Templates</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="funnels">Funnels</TabsTrigger>
            <TabsTrigger value="leads">Leads & Deals</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="industries">Industries</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Platform Settings</CardTitle>
                <CardDescription>
                  Configure core parameters that affect all automation and reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GeneralSettings onChanged={() => setHasUnsavedChanges(true)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Configuration & Templates</CardTitle>
                <CardDescription>
                  Control AI prompt behavior and content generation to automate reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AITemplatesSettings onChanged={() => setHasUnsavedChanges(true)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Report Settings</CardTitle>
                <CardDescription>
                  Configure free vs. paid report generation and automation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReportSettings onChanged={() => setHasUnsavedChanges(true)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funnels" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Funnel & Landing Page Settings</CardTitle>
                <CardDescription>
                  Configure and automate the funnel for each deal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FunnelSettings onChanged={() => setHasUnsavedChanges(true)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Leads & Deals Automation</CardTitle>
                <CardDescription>
                  Control automatic lead creation, deal assignment, and AI insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LeadsDealsSettings onChanged={() => setHasUnsavedChanges(true)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment & Pricing Settings</CardTitle>
                <CardDescription>
                  Configure payments for paid reports and deals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentSettings onChanged={() => setHasUnsavedChanges(true)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="industries" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Industry Settings</CardTitle>
                <CardDescription>
                  Tailor AI reports to each vertical for more accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IndustrySettings onChanged={() => setHasUnsavedChanges(true)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>
                  Connect external services and APIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IntegrationSettings onChanged={() => setHasUnsavedChanges(true)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure logging, backups, and system alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SystemSettings onChanged={() => setHasUnsavedChanges(true)} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
