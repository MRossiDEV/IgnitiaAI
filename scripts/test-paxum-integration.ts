/**
 * Test script for Paxum/Paxos payment integration
 * 
 * Usage:
 *   npx tsx scripts/test-paxum-integration.ts
 * 
 * This script tests:
 * 1. OAuth2 token acquisition
 * 2. Payment creation
 * 3. Payment status checking
 */

import { getPaxumToken, getTokenInfo, clearTokenCache } from "../lib/paxum/token"
import { createPaxosPayment, getPaxosPaymentByRefId } from "../lib/paxum/client"

async function testTokenAcquisition() {
  console.log("\n=== Testing Token Acquisition ===")
  
  try {
    // Clear any cached token
    clearTokenCache()
    console.log("✓ Cleared token cache")

    // Get new token
    const token = await getPaxumToken()
    console.log("✓ Successfully acquired token")
    console.log(`  Token (first 20 chars): ${token.substring(0, 20)}...`)

    // Check token info
    const tokenInfo = getTokenInfo()
    console.log("✓ Token info:", tokenInfo)

    // Test token caching - should return same token
    const cachedToken = await getPaxumToken()
    if (token === cachedToken) {
      console.log("✓ Token caching works correctly")
    } else {
      console.log("✗ Token caching failed - got different token")
    }

    return true
  } catch (error) {
    console.error("✗ Token acquisition failed:", error)
    return false
  }
}

async function testPaymentCreation() {
  console.log("\n=== Testing Payment Creation ===")

  try {
    const testPayment = {
      amount: "10.00",
      currency: "USD",
      description: "Test Payment - Ignitia AI",
      ref_id: `test-lead-${Date.now()}`,
    }

    console.log("Creating payment with:", testPayment)

    const payment = await createPaxosPayment(testPayment)
    console.log("✓ Payment created successfully")
    console.log("  Payment ID:", payment.id)
    console.log("  Ref ID:", payment.ref_id)
    console.log("  Status:", payment.status)
    console.log("  Payment URL:", payment.payment_url || "N/A")

    return payment.ref_id
  } catch (error) {
    console.error("✗ Payment creation failed:", error)
    return null
  }
}

async function testPaymentStatusCheck(refId: string) {
  console.log("\n=== Testing Payment Status Check ===")

  try {
    console.log(`Checking status for ref_id: ${refId}`)

    const payment = await getPaxosPaymentByRefId(refId)

    if (payment) {
      console.log("✓ Payment found")
      console.log("  Payment ID:", payment.id)
      console.log("  Ref ID:", payment.ref_id)
      console.log("  Amount:", payment.amount)
      console.log("  Status:", payment.status)
      return true
    } else {
      console.log("✗ Payment not found")
      return false
    }
  } catch (error) {
    console.error("✗ Payment status check failed:", error)
    return false
  }
}

async function runTests() {
  console.log("╔════════════════════════════════════════════════════════╗")
  console.log("║   Paxum/Paxos Payment Integration Test Suite          ║")
  console.log("╚════════════════════════════════════════════════════════╝")

  // Check environment variables
  console.log("\n=== Checking Environment Variables ===")
  const requiredEnvVars = [
    "PAXUM_CLIENT_ID",
    "PAXUM_CLIENT_SECRET",
    "PAXUM_API_BASE_URL",
    "PAXUM_OAUTH_URL",
  ]

  let envVarsOk = true
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`✓ ${envVar} is set`)
    } else {
      console.log(`✗ ${envVar} is missing`)
      envVarsOk = false
    }
  }

  if (!envVarsOk) {
    console.log("\n❌ Missing required environment variables. Please check your .env.local file.")
    process.exit(1)
  }

  // Run tests
  const results = {
    tokenAcquisition: false,
    paymentCreation: false,
    paymentStatusCheck: false,
  }

  // Test 1: Token Acquisition
  results.tokenAcquisition = await testTokenAcquisition()

  if (!results.tokenAcquisition) {
    console.log("\n❌ Token acquisition failed. Cannot proceed with other tests.")
    process.exit(1)
  }

  // Test 2: Payment Creation
  const refId = await testPaymentCreation()
  results.paymentCreation = refId !== null

  // Test 3: Payment Status Check (only if payment was created)
  if (refId) {
    // Wait a moment for the payment to be registered
    console.log("\nWaiting 2 seconds before checking status...")
    await new Promise((resolve) => setTimeout(resolve, 2000))

    results.paymentStatusCheck = await testPaymentStatusCheck(refId)
  }

  // Summary
  console.log("\n╔════════════════════════════════════════════════════════╗")
  console.log("║   Test Results Summary                                 ║")
  console.log("╚════════════════════════════════════════════════════════╝")
  console.log(`Token Acquisition:     ${results.tokenAcquisition ? "✓ PASS" : "✗ FAIL"}`)
  console.log(`Payment Creation:      ${results.paymentCreation ? "✓ PASS" : "✗ FAIL"}`)
  console.log(`Payment Status Check:  ${results.paymentStatusCheck ? "✓ PASS" : "✗ FAIL"}`)

  const allPassed = Object.values(results).every((result) => result)
  console.log(`\n${allPassed ? "✅ All tests passed!" : "❌ Some tests failed"}`)

  process.exit(allPassed ? 0 : 1)
}

// Run tests
runTests().catch((error) => {
  console.error("\n❌ Unexpected error:", error)
  process.exit(1)
})

