"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import type { AuthUser, UserRole } from '@/lib/auth/supabase-auth'
import { getCurrentUser, signOut as authSignOut } from '@/lib/auth/supabase-auth'

// ============================================================================
// AUTH HOOK
// ============================================================================

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    getCurrentUser().then((user) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const currentUser = await getCurrentUser()
          setUser(currentUser)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await authSignOut()
    setUser(null)
    router.push('/login')
  }

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user?.profile) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.profile.role)
  }

  const isAdmin = (): boolean => {
    return hasRole(['admin', 'super_admin'])
  }

  const isPartner = (): boolean => {
    return hasRole('partner')
  }

  return {
    user,
    loading,
    signOut,
    hasRole,
    isAdmin,
    isPartner,
    isAuthenticated: !!user,
  }
}

