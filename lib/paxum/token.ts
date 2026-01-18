import { PaxosTokenResponse } from "../models/payment"

// ============================================================================
// TOKEN CACHE
// Simple in-memory cache for OAuth2 tokens
// In production, consider using Redis or similar
// ============================================================================

interface TokenCache {
  accessToken: string
  expiresAt: number
}

let tokenCache: TokenCache | null = null

// ============================================================================
// GET PAXUM/PAXOS OAUTH2 TOKEN
// ============================================================================

export async function getPaxumToken(): Promise<string> {
  // Check if we have a valid cached token
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.accessToken
  }

  // Validate environment variables
  const clientId = process.env.PAXUM_CLIENT_ID
  const clientSecret = process.env.PAXUM_CLIENT_SECRET
  const oauthUrl = process.env.PAXUM_OAUTH_URL || "https://oauth.paxos.com/oauth2/token"

  if (!clientId || !clientSecret) {
    throw new Error("Missing Paxum credentials: PAXUM_CLIENT_ID and PAXUM_CLIENT_SECRET are required")
  }

  try {
    // Request new token
    const response = await fetch(oauthUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to get Paxum token: ${response.status} ${errorText}`)
    }

    const data: PaxosTokenResponse = await response.json()

    // Cache the token (subtract 60 seconds for safety margin)
    tokenCache = {
      accessToken: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    }

    return data.access_token
  } catch (error) {
    console.error("Error getting Paxum token:", error)
    throw error
  }
}

// ============================================================================
// CLEAR TOKEN CACHE
// Useful for testing or forcing token refresh
// ============================================================================

export function clearTokenCache(): void {
  tokenCache = null
}

// ============================================================================
// GET TOKEN INFO
// For debugging purposes
// ============================================================================

export function getTokenInfo(): { hasToken: boolean; expiresAt?: number } {
  if (!tokenCache) {
    return { hasToken: false }
  }

  return {
    hasToken: true,
    expiresAt: tokenCache.expiresAt,
  }
}

