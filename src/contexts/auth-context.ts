import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

export type SignUpInput = { fullName: string; email: string; password: string }
export type SignInInput = { email: string; password: string }

export type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  configured: boolean
  signUp: (input: SignUpInput) => Promise<{ needsEmailConfirmation: boolean }>
  signIn: (input: SignInInput) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
