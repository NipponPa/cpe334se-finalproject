'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { updateProfileWithGoogleAvatar } from '@/lib/profilePictureUtils'

type AuthContextType = {
  user: User | null
  // Using any for Supabase auth responses as they are complex types
 signUp: (email: string, password: string) => Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  signIn: (email: string, password: string) => Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  signInWithOAuth: (provider: 'google' | 'github' | 'facebook') => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any
 loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)

      // Listen for auth changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (_event, session) => {
          const currentUser = session?.user || null;
          setUser(currentUser);
          
          // If user signed in with Google and doesn't have an avatar yet,
          // try to set their Google profile picture as their avatar
          if (currentUser && currentUser.app_metadata?.provider === 'google') {
            const googleAvatar = currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture;
            if (googleAvatar) {
              // Update the user's profile with the Google avatar
              await updateProfileWithGoogleAvatar(currentUser.id, googleAvatar);
            }
          }
          
          setLoading(false);
        }
      )

      return () => {
        subscription.unsubscribe()
      }
    }

    getUser()
  }, [])

  const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password })
  }

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signInWithOAuth = async (provider: 'google' | 'github' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/`
      }
    })
    
    if (error) {
      console.error('OAuth error:', error)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/` // Adjust the redirect URL as needed
    });
  }

  const value = {
    user,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}