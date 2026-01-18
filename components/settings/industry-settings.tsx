"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2 } from "lucide-react"

interface IndustrySettingsProps {
  onChanged: () => void
}

export function IndustrySettings({ onChanged }: IndustrySettingsProps) {
  const [industries, setIndustries] = useState([
    { id: "1", name: "Hospitality", displayName: "Hotels & Resorts", active: true },
    { id: "2", name: "Tourism", displayName: "Travel & Tourism", active: true },
    { id: "3", name: "Services", displayName: "Professional Services", active: false },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Industry Configurations</h3>
          <p className="text-sm text-muted-foreground">
            Customize AI prompts and metrics for each industry vertical
          </p>
        </div>
        <Button onClick={onChanged}>
          <Plus className="mr-2 h-4 w-4" />
          Add Industry
        </Button>
      </div>

      <div className="space-y-3">
        {industries.map((industry) => (
          <Card key={industry.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <CardTitle className="text-base">{industry.displayName}</CardTitle>
                    <CardDescription className="text-sm">{industry.name}</CardDescription>
                  </div>
                  <Badge variant={industry.active ? "default" : "secondary"}>
                    {industry.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={onChanged}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onChanged}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Custom metrics: Revenue per room, Occupancy rate, ADR</p>
                <p>AI prompt overrides configured</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

