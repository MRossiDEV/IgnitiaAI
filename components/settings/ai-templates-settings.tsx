"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Trash2, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AITemplatesSettingsProps {
  onChanged: () => void
}

export function AITemplatesSettings({ onChanged }: AITemplatesSettingsProps) {
  const [templates, setTemplates] = useState([
    { id: "1", name: "Free Report Template", type: "free_report", model: "gpt-4" },
    { id: "2", name: "Paid Report Template", type: "paid_report", model: "gpt-4" },
  ])

  return (
    <div className="space-y-6">
      {/* Template List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">AI Templates</h3>
            <p className="text-sm text-muted-foreground">
              Manage AI prompts for report generation
            </p>
          </div>
          <Button onClick={onChanged}>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>

        <div className="space-y-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge variant="outline">{template.type}</Badge>
                    <Badge variant="secondary">{template.model}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onChanged}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onChanged}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Default AI Settings</CardTitle>
          <CardDescription>
            Configure default parameters for AI report generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Model</Label>
              <Select defaultValue="gpt-4" onValueChange={onChanged}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Temperature</Label>
              <Input type="number" defaultValue="0.7" step="0.1" min="0" max="2" onChange={onChanged} />
            </div>

            <div className="space-y-2">
              <Label>Max Tokens</Label>
              <Input type="number" defaultValue="2000" onChange={onChanged} />
            </div>

            <div className="space-y-2">
              <Label>Output Format</Label>
              <Select defaultValue="markdown" onValueChange={onChanged}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="markdown">Markdown</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Available Placeholders</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{"{businessName}"}</Badge>
              <Badge variant="secondary">{"{website}"}</Badge>
              <Badge variant="secondary">{"{industry}"}</Badge>
              <Badge variant="secondary">{"{painPoints}"}</Badge>
              <Badge variant="secondary">{"{revenueRange}"}</Badge>
              <Badge variant="secondary">{"{businessSize}"}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Use these placeholders in your prompts to dynamically insert data
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

