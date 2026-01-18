"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface FunnelSettingsProps {
  onChanged: () => void
}

export function FunnelSettings({ onChanged }: FunnelSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Funnel Templates</CardTitle>
          <CardDescription>
            Manage funnel templates for deals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onChanged}>
            <Plus className="mr-2 h-4 w-4" />
            Create Funnel Template
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No funnel templates configured yet. Create your first template to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

