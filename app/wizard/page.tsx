"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Check, HelpCircle, Sparkles, TrendingUp, Users, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

type WizardData = {
  industry: string
  businessSize: string
  revenueRange: string
  pains: string[]
  growthGaps: string[]
  reportType: "free" | "full" | "later"
  email: string
  businessName?: string
  website?: string
  otherPain?: string
  otherGap?: string
}

const industries = [
  "Hospitality",
  "Local Services",
  "Tourism",
  "E-commerce",
  "Coaching / Consulting",
]

const painPoints = [
  { value: "Leads but low conversions", tooltip: "You're getting traffic but struggling to turn visitors into customers" },
  { value: "No clear growth strategy", tooltip: "You're unsure which marketing channels or tactics will drive the most growth" },
  { value: "Inconsistent revenue", tooltip: "Your income fluctuates month-to-month without predictability" },
  { value: "Dependence on referrals", tooltip: "Most of your business comes from word-of-mouth, limiting scalability" },
  { value: "Poor follow-up", tooltip: "Leads slip through the cracks due to manual or inconsistent follow-up" },
  { value: "Ads not converting", tooltip: "You're spending on ads but not seeing a positive ROI" },
]

const growthGaps = [
  { value: "No automated follow-up", tooltip: "Missing opportunities because you can't follow up with every lead automatically" },
  { value: "No upsells or cross-sells", tooltip: "Not maximizing revenue from existing customers" },
  { value: "Unclear customer journey", tooltip: "Prospects don't have a clear path from awareness to purchase" },
  { value: "No conversion tracking", tooltip: "You can't measure what's working and what's not" },
  { value: "Website not optimized", tooltip: "Your site isn't designed to convert visitors into leads or customers" },
]

export default function GrowthAuditWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")

  const [data, setData] = useState<WizardData>({
    industry: "",
    businessSize: "",
    revenueRange: "",
    pains: [],
    growthGaps: [],
    reportType: "free",
    email: "",
    businessName: "",
    website: "",
    otherPain: "",
    otherGap: "",
  })

  const totalSteps = 6
  const progressPercentage = (step / totalSteps) * 100

  const next = () => setStep((s) => s + 1)
  const back = () => setStep((s) => s - 1)

  const toggleArrayValue = (
    key: "pains" | "growthGaps",
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }))
  }

  // Pure validation function (no side effects)
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return email && emailRegex.test(email)
  }

  // Validation with error setting (for form submission)
  const validateEmailWithError = (email: string) => {
    if (!email) {
      setEmailError("Email is required")
      return false
    }
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  const getProgressMessage = () => {
    if (step === 1) return "Let's get started!"
    if (step === 2) return "Great! Now let's identify your challenges"
    if (step === 3) return "Almost halfway there!"
    if (step === 4) return "You're doing great! Choose your report type"
    if (step === 5) return "Almost done! Just one more step"
    if (step === 6) return "All done! 🎉"
    return ""
  }

  const submitAudit = async () => {
    // Validate email before submitting
    if (!validateEmailWithError(data.email)) {
      return
    }

    setLoading(true)

    try {
      // If user selected paid report, create payment session
      if (data.reportType === "full") {
        // First, create the lead/report (you would implement this API)
        const leadResponse = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            industry: data.industry,
            businessName: data.businessName,
            website: data.website,
            metadata: {
              businessSize: data.businessSize,
              revenueRange: data.revenueRange,
              pains: data.pains,
              growthGaps: data.growthGaps,
              otherPain: data.otherPain,
              otherGap: data.otherGap,
            },
          }),
        })

        if (!leadResponse.ok) {
          throw new Error("Failed to create lead")
        }

        const leadData = await leadResponse.json()
        const leadId = leadData.id || `lead_${Date.now()}`
        const reportId = `report_blueprint_${Date.now()}`

        // Create payment session
        const paymentResponse = await fetch("/api/paxum/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 500.0,
            currency: "USD",
            description: "Ignitia AI Growth Blueprint",
            reportId: reportId,
            leadId: leadId,
          }),
        })

        if (!paymentResponse.ok) {
          throw new Error("Failed to create payment session")
        }

        const paymentData = await paymentResponse.json()

        // Redirect to payment URL
        if (paymentData.paymentUrl) {
          window.location.href = paymentData.paymentUrl
        } else {
          // Fallback: redirect to payment status page
          router.push(`/payments/${paymentData.paymentSessionId}`)
        }
      } else {
        // Free report - existing flow
        await fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        next()
      }
    } catch (error) {
      console.error("Error submitting audit:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        {/* PROGRESS BAR */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              {getProgressMessage()}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* STEP 1 – BUSINESS CONTEXT */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Tell us about your business
              </h2>
              <p className="text-muted-foreground">
                This helps us tailor your audit to your business type and identify the most relevant opportunities
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium mb-2">
                  Business Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Enter your business name"
                  value={data.businessName}
                  onChange={(e) =>
                    setData({ ...data, businessName: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium mb-2 flex items-center gap-2">
                  Website
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Optional but helps us provide a more accurate analysis</p>
                    </TooltipContent>
                  </Tooltip>
                </label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourbusiness.com"
                  value={data.website}
                  onChange={(e) =>
                    setData({ ...data, website: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium mb-2">
                  Industry <span className="text-destructive">*</span>
                </label>
                <select
                  id="industry"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={data.industry}
                  onChange={(e) =>
                    setData({ ...data, industry: e.target.value })
                  }
                >
                  <option value="">Select your industry</option>
                  {industries.map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="businessSize" className="block text-sm font-medium mb-2">
                    Business Size
                  </label>
                  <select
                    id="businessSize"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={data.businessSize}
                    onChange={(e) =>
                      setData({ ...data, businessSize: e.target.value })
                    }
                  >
                    <option value="">Select size</option>
                    <option>Solo</option>
                    <option>2–5 employees</option>
                    <option>6–20 employees</option>
                    <option>20+</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="revenueRange" className="block text-sm font-medium mb-2">
                    Monthly Revenue
                  </label>
                  <select
                    id="revenueRange"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={data.revenueRange}
                    onChange={(e) =>
                      setData({ ...data, revenueRange: e.target.value })
                    }
                  >
                    <option value="">Select range</option>
                    <option>$0 – $5k</option>
                    <option>$5k – $20k</option>
                    <option>$20k – $50k</option>
                    <option>$50k+</option>
                  </select>
                </div>
              </div>
            </div>

            <Button
              disabled={!data.industry || !data.businessName}
              onClick={next}
              className="w-full"
              size="lg"
            >
              Continue
            </Button>
          </div>
        )}

        {/* STEP 2 – PAIN DISCOVERY */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                What's limiting your growth?
              </h2>
              <p className="text-muted-foreground">
                Select all that apply. We'll focus on these areas in your audit.
              </p>
            </div>

            <div className="grid gap-3">
              {painPoints.map((pain) => (
                <Tooltip key={pain.value}>
                  <TooltipTrigger asChild>
                    <Card
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md border-2",
                        data.pains.includes(pain.value)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => toggleArrayValue("pains", pain.value)}
                    >
                      <CardContent className="flex items-center gap-3 p-4">
                        <div
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
                            data.pains.includes(pain.value)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground"
                          )}
                        >
                          {data.pains.includes(pain.value) && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                        <span className="font-medium flex-1">{pain.value}</span>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>{pain.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}

              {/* Other option */}
              <Card className="border-2 border-dashed">
                <CardContent className="p-4">
                  <Input
                    placeholder="Other (please specify)"
                    value={data.otherPain}
                    onChange={(e) =>
                      setData({ ...data, otherPain: e.target.value })
                    }
                  />
                </CardContent>
              </Card>
            </div>

            {data.pains.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{data.pains.length} selected</Badge>
                <span>We'll analyze these pain points in your audit</span>
              </div>
            )}

            <div className="flex justify-between gap-4">
              <Button onClick={back} variant="outline" size="lg">
                Back
              </Button>
              <Button onClick={next} size="lg" className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 – GROWTH GAPS */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Where do you think money is leaking?
              </h2>
              <p className="text-muted-foreground">
                Identify the gaps in your growth system
              </p>
            </div>

            <div className="grid gap-3">
              {growthGaps.map((gap) => (
                <Tooltip key={gap.value}>
                  <TooltipTrigger asChild>
                    <Card
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md border-2",
                        data.growthGaps.includes(gap.value)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => toggleArrayValue("growthGaps", gap.value)}
                    >
                      <CardContent className="flex items-center gap-3 p-4">
                        <div
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
                            data.growthGaps.includes(gap.value)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground"
                          )}
                        >
                          {data.growthGaps.includes(gap.value) && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                        <span className="font-medium flex-1">{gap.value}</span>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>{gap.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}

              {/* Other option */}
              <Card className="border-2 border-dashed">
                <CardContent className="p-4">
                  <Input
                    placeholder="Other (please specify)"
                    value={data.otherGap}
                    onChange={(e) =>
                      setData({ ...data, otherGap: e.target.value })
                    }
                  />
                </CardContent>
              </Card>
            </div>

            {data.growthGaps.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{data.growthGaps.length} selected</Badge>
                <span>We'll focus on these areas in your blueprint</span>
              </div>
            )}

            <div className="flex justify-between gap-4">
              <Button onClick={back} variant="outline" size="lg">
                Back
              </Button>
              <Button onClick={next} size="lg" className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4 – REPORT CHOICE */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Choose your audit type
              </h2>
              <p className="text-muted-foreground">
                {data.pains.length > 2
                  ? "Based on your challenges, we recommend the Full Blueprint for comprehensive solutions"
                  : "Select the level of analysis that's right for you"}
              </p>
            </div>

            <div className="space-y-4">
              {/* Free Report */}
              <Card
                className={cn(
                  "cursor-pointer transition-all border-2 hover:shadow-md",
                  data.reportType === "free"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => setData({ ...data, reportType: "free" })}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors mt-1",
                        data.reportType === "free"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground"
                      )}
                    >
                      {data.reportType === "free" && <Check className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">Free Growth Snapshot</h3>
                        <Badge variant="secondary">Free</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Get a high-level overview of your growth opportunities
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>Basic revenue leak analysis</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>Top 3 growth opportunities</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>Industry benchmarks</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Full Blueprint */}
              <Card
                className={cn(
                  "cursor-pointer transition-all border-2 hover:shadow-lg relative overflow-hidden",
                  data.reportType === "full"
                    ? "border-primary bg-primary/5"
                    : "border-primary/30 hover:border-primary"
                )}
                onClick={() => setData({ ...data, reportType: "full" })}
              >
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
                  RECOMMENDED
                </div>
                <CardContent className="p-6 pt-8">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors mt-1",
                        data.reportType === "full"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-primary"
                      )}
                    >
                      {data.reportType === "full" && <Check className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">Full Growth Blueprint</h3>
                        <Badge className="bg-primary">$500</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Complete analysis with actionable strategies and implementation roadmap
                      </p>
                      <ul className="space-y-2 text-sm mb-4">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="font-medium">Everything in Free, plus:</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>Detailed funnel analysis & optimization plan</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>Custom automation recommendations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>90-day implementation roadmap</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>Revenue recovery projections</span>
                        </li>
                      </ul>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>500+ businesses served</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          <span>Avg. $50k recovered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Decide Later */}
              <button
                onClick={() => {
                  setData({ ...data, reportType: "later" })
                }}
                className="w-full text-sm text-muted-foreground hover:text-foreground underline transition-colors"
              >
                I'll decide later
              </button>
            </div>

            <div className="flex justify-between gap-4">
              <Button onClick={back} variant="outline" size="lg">
                Back
              </Button>
              <Button
                onClick={next}
                size="lg"
                className="flex-1"
                disabled={!data.reportType || data.reportType === "later"}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5 – EMAIL */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Where should we send your {data.reportType === "full" ? "blueprint" : "audit"}?
              </h2>
              <p className="text-muted-foreground">
                {data.reportType === "full"
                  ? "You'll receive your comprehensive growth blueprint after payment"
                  : "We'll email your free audit immediately"}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@business.com"
                  value={data.email}
                  onChange={(e) => {
                    setData({ ...data, email: e.target.value })
                    if (emailError) setEmailError("")
                  }}
                  className={cn(
                    "w-full",
                    emailError && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {emailError && (
                  <p className="text-sm text-destructive mt-1">{emailError}</p>
                )}
                {!emailError && data.email && isValidEmail(data.email) && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                    <Check className="h-4 w-4" />
                    <span>Valid email</span>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Your data is safe</p>
                  <p>We never sell email addresses. Unsubscribe anytime.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <Button onClick={back} variant="outline" size="lg">
                Back
              </Button>
              <Button
                disabled={!data.email || loading}
                onClick={submitAudit}
                size="lg"
                className="flex-1"
              >
                {loading ? (
                  <>Generating...</>
                ) : data.reportType === "full" ? (
                  <>Purchase Full Blueprint - $500</>
                ) : (
                  <>Generate My Free Audit</>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 6 – CONFIRMATION */}
        {step === 6 && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-2">
                Your audit is being generated!
              </h2>
              <p className="text-muted-foreground">
                We're analyzing your answers and identifying revenue recovery opportunities
              </p>
            </div>

            {/* Dynamic Recap */}
            <Card className="text-left">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">What we're analyzing:</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Business:</span>
                    <span className="ml-2 font-medium">{data.businessName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Industry:</span>
                    <span className="ml-2 font-medium">{data.industry}</span>
                  </div>
                  {data.pains.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Pain Points:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {data.pains.map((pain) => (
                          <Badge key={pain} variant="secondary">{pain}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {data.growthGaps.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Growth Gaps:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {data.growthGaps.map((gap) => (
                          <Badge key={gap} variant="secondary">{gap}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <p className="font-semibold text-lg">
                Check your email in 5–10 minutes
              </p>
              <p className="text-sm text-muted-foreground">
                Want deeper insights? Schedule a 15-minute strategy call with our team
              </p>
              <Button variant="outline" size="lg" className="mt-4">
                Schedule Strategy Call
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}


