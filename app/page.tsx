"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Check, X, ArrowRight, Shield, TrendingUp, Target, Users, Clock } from "lucide-react"

const INDUSTRIES = [
  "Hospitality",
  "Local Services",
  "Tourism",
  "Ecommerce",
  "Agency",
  "Other",
]

export default function LandingPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [industry, setIndustry] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [website, setWebsite] = useState("")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }
  }

  const handleStart = (selectedIndustry: string) => {
    setIndustry(selectedIndustry)
    setStep(2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!businessName || !email) return
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    const query = new URLSearchParams({
      industry,
      businessName,
      website,
      email,
    }).toString()

    window.location.href = `/wizard?${query}`
  }



  return (
    <div className="w-full">

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-b from-white to-purple-50 py-24">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900">
              Your business is leaking revenue — do you know where?
            </h1>

            <p className="text-lg sm:text-xl text-gray-600">
              Most businesses lose <strong>10–30% of potential revenue</strong> due to
              hidden growth bottlenecks.
              <br />
              This free audit shows you exactly where — and what to fix first.
            </p>

            {/* Social Proof & Urgency */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
                <Users className="w-4 h-4 text-purple-600" />
                <span><strong>500+ businesses</strong> improved revenue</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-700 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
                <Clock className="w-4 h-4 text-orange-600" />
                <span><strong>12 spots left</strong> this week</span>
              </div>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="font-medium text-gray-700">
                  Pick your industry to get a tailored audit
                </p>

                <div className="flex flex-wrap gap-3">
                  {INDUSTRIES.map(i => (
                    <Button
                      key={i}
                      variant="outline"
                      className="hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 hover:scale-105"
                      onClick={() => handleStart(i)}
                    >
                      {i}
                    </Button>
                  ))}
                </div>

                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Takes 2 minutes • Free, no credit card required
                </p>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">
                      Free Growth & Revenue Audit for <strong className="text-purple-600">{industry}</strong> businesses
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      {industry}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">Step 2 of 2</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Business Name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                      className="focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>

                  <div>
                    <Input
                      placeholder="Website (optional)"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>

                  <div>
                    <Input
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      className={`focus:ring-2 focus:ring-purple-500 transition-all ${emailError ? 'border-red-500' : ''}`}
                    />
                    {emailError && (
                      <p className="text-xs text-red-600 mt-1">{emailError}</p>
                    )}
                    {!emailError && email && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        We will never spam you or share your email
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={!businessName || !email || !!emailError}
                    className="bg-purple-600 hover:bg-purple-700 text-white w-full group transition-all hover:scale-105"
                  >
                    Start My Free Audit
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                <p className="text-xs text-gray-500">
                  You’ll receive a free audit summary.
                  <br />
                  A deeper growth blueprint is optional later.
                </p>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex justify-center">
            <img
              src="/hero-illustration.svg"
              alt="Growth Audit"
              className="w-full max-w-md rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <CardHeader>
              <TrendingUp className="text-purple-600 mb-2 w-8 h-8" />
              <CardTitle>Where You’re Losing Money</CardTitle>
              <CardDescription>
                Identify <strong>10-30% missed revenue</strong> in leads, offers, follow-up, and conversion paths.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <CardHeader>
              <Target className="text-purple-600 mb-2 w-8 h-8" />
              <CardTitle>Your Growth Bottleneck</CardTitle>
              <CardDescription>
                Find the single constraint keeping your revenue stuck.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <CardHeader>
              <Check className="text-purple-600 mb-2 w-8 h-8" />
              <CardTitle>What To Fix First</CardTitle>
              <CardDescription>
                Get prioritized actions — not generic advice.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works — Simple & Fast
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold">Answer 8 Questions</h3>
              <p className="text-gray-600">
                Tell us about your business, leads, offers, and conversion process. Takes 3 minutes.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold">Get Your Audit</h3>
              <p className="text-gray-600">
                Receive a personalized report showing where you are losing revenue and why.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold">Fix & Grow</h3>
              <p className="text-gray-600">
                Implement the prioritized actions and watch your revenue increase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SOCIAL PROOF ================= */}
      <section className="py-24 bg-purple-50">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Used by growth-focused business owners
          </h2>

          <p className="text-gray-600">
            Businesses in hospitality, tourism, and services have uncovered
            tens of thousands in missed revenue opportunities.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <strong>Hospitality Business</strong>
              </div>
              <p className="text-gray-600">
                Identified <strong className="text-purple-600">$42,000/year</strong> in missed upsells and pricing gaps.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <strong>Local Service Company</strong>
              </div>
              <p className="text-gray-600">
                Increased lead-to-customer conversion by <strong className="text-purple-600">27%</strong>.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <strong>Tourism Agency</strong>
              </div>
              <p className="text-gray-600">
                Fixed bottleneck and grew monthly revenue by <strong className="text-purple-600">$18k</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOR / NOT FOR ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div className="bg-green-50 p-8 rounded-2xl border-2 border-green-200">
            <h3 className="text-2xl font-bold mb-6 text-green-900">This is for you if:</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-700">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Revenue feels stuck or unpredictable</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span>You get leads but not enough conversions</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span>You want clarity instead of guessing</span>
              </li>
            </ul>
          </div>

          <div className="bg-red-50 p-8 rounded-2xl border-2 border-red-200">
            <h3 className="text-2xl font-bold mb-6 text-red-900">This is NOT for you if:</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-700">
                <X className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <span>You want overnight hacks</span>
              </li>
              <li>• You’re not open to improving systems</li>
              <li>• You’re just curious with no intent to act</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= WHY FREE ================= */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              Why we offer this audit for free
            </h2>

            <p className="text-gray-700">
              We don’t sell reports.
              <br />
              We design growth systems for businesses that want predictable revenue.
            </p>

            <p className="text-gray-700">
              This audit helps business owners gain clarity —
              and helps us identify where we can genuinely add value.
            </p>

            <p className="font-semibold text-purple-700">
              The audit shows you what’s wrong.
              <br />
              The optional blueprint shows you exactly how to fix it.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-4">What we actually do</h3>
            <ul className="space-y-3 text-gray-700">
              <li>✓ Build industry-specific growth strategies</li>
              <li>✓ Design automated funnels and conversion systems</li>
              <li>✓ Optimize offers, messaging, and revenue flow</li>
              <li>✓ Help businesses scale without guessing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-24 bg-gradient-to-br from-purple-600 to-purple-800 text-white text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl font-bold">
            Ready to see where your revenue is leaking?
          </h2>

          <p className="text-gray-600">
            Start your free Growth & Revenue Audit and uncover what’s holding
            your business back.
          </p>

          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Start Free Audit
          </Button>
        </div>
      </section>

      {/* ================= STICKY CTA BAR ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-purple-600 text-white py-4 px-6 shadow-2xl z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-bold text-lg">Find Your Revenue Leaks Today</p>
            <p className="text-sm text-purple-200">Free audit • 3 minutes • Instant insights</p>
          </div>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 font-bold shadow-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Get Started Free →
          </Button>
        </div>
      </div>
    </div>
  )
}
