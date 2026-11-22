import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { AuthContext, type SignInInput, type SignUpInput } from './auth-context'

type AuthProviderProps = { children: ReactNode }

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) {
      return
    }

    const client = supabase
    let active = true

    const loadSession = async () => {
      try {
        const { data, error } = await client.auth.getSession()
        if (error) throw error
        if (active) setSession(data.session)
      } catch {
        if (active) setSession(null)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadSession()

    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession)
        setLoading(false)
      }
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({
    user: session?.user ?? null,
    session,
    loading,
    configured: isSupabaseConfigured,
    signUp: async ({ fullName, email, password }: SignUpInput) => {
      if (!supabase) throw new Error('O Supabase ainda não foi configurado neste ambiente.')
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { full_name: fullName.trim() },
          emailRedirectTo: `${window.location.origin}/conta`,
        },
      })
      if (error) throw error
      return { needsEmailConfirmation: !data.session }
    },
    signIn: async ({ email, password }: SignInInput) => {
      if (!supabase) throw new Error('O Supabase ainda não foi configurado neste ambiente.')
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
      if (error) throw error
    },
    signOut: async () => {
      if (!supabase) return
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
  }), [loading, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
