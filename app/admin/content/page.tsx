"use client"

import { FileText, Mail, MessageSquare, Shield, Plus, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ContentTemplatesPage() {
  return (
    <div className="p-4 md:p-6 space-y-6 w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-purple-700">Content & Templates</h1>
          <p className="text-sm text-gray-500 mt-1">Speed + Consistency</p>
        </div>
        <Button disabled>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* COMING SOON BANNER */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-sm text-purple-900">
                Content & Templates are coming in the Scale Phase
              </p>
              <p className="text-xs text-purple-700 mt-1">
                Build your core product first. Templates will help you scale messaging once you know what works.
              </p>
            </div>
            <Badge variant="secondary">Scale Phase</Badge>
          </div>
        </CardContent>
      </Card>

      {/* PLANNED FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5" />
              Email Templates
            </CardTitle>
            <CardDescription>Reusable email content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              • Welcome emails
            </div>
            <div className="text-sm text-muted-foreground">
              • Audit delivery emails
            </div>
            <div className="text-sm text-muted-foreground">
              • Follow-up sequences
            </div>
            <div className="text-sm text-muted-foreground">
              • Payment confirmation
            </div>
            <div className="text-sm text-muted-foreground">
              • Upsell emails
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Report Copy Blocks
            </CardTitle>
            <CardDescription>Reusable report sections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              • Introduction templates
            </div>
            <div className="text-sm text-muted-foreground">
              • Industry-specific insights
            </div>
            <div className="text-sm text-muted-foreground">
              • Recommendation frameworks
            </div>
            <div className="text-sm text-muted-foreground">
              • Call-to-action blocks
            </div>
            <div className="text-sm text-muted-foreground">
              • Disclaimer text
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5" />
              Industry-Specific Messaging
            </CardTitle>
            <CardDescription>Tailored content by vertical</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              • E-commerce messaging
            </div>
            <div className="text-sm text-muted-foreground">
              • SaaS messaging
            </div>
            <div className="text-sm text-muted-foreground">
              • Local business messaging
            </div>
            <div className="text-sm text-muted-foreground">
              • B2B messaging
            </div>
            <div className="text-sm text-muted-foreground">
              • Service business messaging
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Legal & Footer Content
            </CardTitle>
            <CardDescription>Compliance and standard text</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              • Privacy policy snippets
            </div>
            <div className="text-sm text-muted-foreground">
              • Terms of service
            </div>
            <div className="text-sm text-muted-foreground">
              • Disclaimers
            </div>
            <div className="text-sm text-muted-foreground">
              • Email footers
            </div>
            <div className="text-sm text-muted-foreground">
              • Unsubscribe text
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BENEFITS */}
      <Card>
        <CardHeader>
          <CardTitle>Why Templates Matter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
            <div>
              <p className="font-medium text-sm">Maintain Consistency</p>
              <p className="text-xs text-muted-foreground">
                Keep messaging on-brand across all touchpoints
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
            <div>
              <p className="font-medium text-sm">Save Time</p>
              <p className="text-xs text-muted-foreground">
                Stop rewriting the same content over and over
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
            <div>
              <p className="font-medium text-sm">Improve Quality</p>
              <p className="text-xs text-muted-foreground">
                Use proven, tested messaging that converts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

