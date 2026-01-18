"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { platformSettingsSchema, type PlatformSettingsFormData } from "@/lib/validators/settings.schema"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Upload, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GeneralSettingsProps {
  onChanged: () => void
}

export function GeneralSettings({ onChanged }: GeneralSettingsProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const form = useForm<PlatformSettingsFormData>({
    resolver: zodResolver(platformSettingsSchema),
    defaultValues: {
      platformName: "Ignitia AI",
      defaultCurrency: "USD",
      timezone: "America/New_York",
      businessVerticals: ["Hospitality", "Tourism", "Services"],
      emailSender: "no-reply@ignitia.ai",
      reportFooterText: "Powered by Ignitia AI",
    },
  })

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
        form.setValue("logoUrl", reader.result as string)
        onChanged()
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Platform Name */}
        <FormField
          control={form.control}
          name="platformName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Platform Name
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Display name shown throughout the platform</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input {...field} onChange={(e) => { field.onChange(e); onChanged() }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Default Currency */}
        <FormField
          control={form.control}
          name="defaultCurrency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Currency</FormLabel>
              <Select onValueChange={(value) => { field.onChange(value); onChanged() }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Currency used for all pricing and reports
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Timezone */}
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <Select onValueChange={(value) => { field.onChange(value); onChanged() }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Default timezone for all timestamps
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Logo Upload */}
        <FormItem>
          <FormLabel>Platform Logo</FormLabel>
          <div className="flex items-center gap-4">
            {logoPreview && (
              <div className="w-24 h-24 border rounded-lg overflow-hidden">
                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
              </div>
            )}
            <div>
              <Button type="button" variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <FormDescription className="mt-2">
                Recommended: PNG or SVG, max 2MB
              </FormDescription>
            </div>
          </div>
        </FormItem>

        {/* Email Sender */}
        <FormField
          control={form.control}
          name="emailSender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Sender</FormLabel>
              <FormControl>
                <Input {...field} type="email" onChange={(e) => { field.onChange(e); onChanged() }} />
              </FormControl>
              <FormDescription>
                Default sender email for reports and notifications
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Report Footer */}
        <FormField
          control={form.control}
          name="reportFooterText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Report Footer Text</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} onChange={(e) => { field.onChange(e); onChanged() }} />
              </FormControl>
              <FormDescription>
                Custom message displayed in all generated reports
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

